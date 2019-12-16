import os
import dlib
import numpy as np
import cv2
import time

# Método que será acionado para realizar o reconhecimento facial
def reconhecimentoFacial(peopleId, identify):
    try:  # Cria um vetor com os indices.@@
        cap = cv2.VideoCapture(1)  # habilita webcam
        contRecognitions = 0
        sinalSair=False
        # detector de faces frontal do próprio dlib
        detectorFace = dlib.get_frontal_face_detector()
        # detector de pontos faciais do próprio dlib
        detectorPontos = dlib.shape_predictor("recursos/shape_predictor_68_face_landmarks.dat")
        reconhecimentoFacial = dlib.face_recognition_model_v1("recursos/dlib_face_recognition_resnet_model_v1.dat")
        indices = np.load("recursos/indices_{}.pickle".format(identify), allow_pickle=True)
        # Carrega as caracteristicas extraidas das faces treinadas.@@
        descritoresFaciais = np.load("recursos/descritores_{}.npy".format(identify), allow_pickle=True)
        # se deu certo abrir os arquivos, instancio variável de margem de acerto de 0 a 1 para o reconhecimento da face
        limiar = 0.45 # com até 30% de erro, quero ainda dizer que a pessoa foi reconhecida
        count=0
        corAlert = {'b': 0, 'g': 0, 'r': 255}
        nome=''
        liberado = ''
    except: #trata erro de abertura dos arquivos
        print('Rede não treinada')
        return '0'
    while True: #enquanto câmera estiver aberta
        conectado, video = cap.read() # realiza a leitura da imagem da câmera
        video = cv2.resize(video, (500,360))
        frame = cv2.flip(video, 2)#padroniza espelhamento da webcam, pois cada uma pode espelhar a imagem de um jeito.
        frameCinza = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)#passa cada frame obtido para a escala de cinza
        facesDetectadas = detectorFace(frame)# Guarda o array de faces detectadas na escala de cinza
        if facesDetectadas: # se houver faces detectadas
            for face in facesDetectadas: # para cada face detectada pega 4 pontos extemos de cada uma delas, esquerda, top, direita, baixo
                e, t, d, b = (int(face.left()), int(face.top()),int(face.right()), int(face.bottom()))
                pontosFaciais = detectorPontos(frame, face)# Aqui estou aplicando o reconhecimento facial a cada 50 frames, para não ficar lento.
                if (count % 20 == 0):#aplicados o reconhecimento facial.
                    descritorFacial = reconhecimentoFacial.compute_face_descriptor(frame, pontosFaciais)# aqui é criado uma lista contendo os resultados obtidos da comparação acima
                    listaDescritorFacial = [fd for fd in descritorFacial]# aqui convertemos essa lista para o formato do numpy para ser
                    npArrayDescritorFacial = np.asarray(listaDescritorFacial, dtype=np.float64)
                    npArrayDescritorFacial = npArrayDescritorFacial[np.newaxis, :]#até aqui a dimensão de cada array é 128, precisamos que tenha 1x128,
                    distancias = np.linalg.norm(npArrayDescritorFacial - descritoresFaciais, axis=1)# calculo da distancia de diferenciação das características obtidas na webcam
                    minimo = np.argmin(distancias)# Aqui é retornado os índices dos valores mínimos obtidos pela 'distancias' ao longo das comparações
                    distanciaMinima = distancias[minimo]# aqui, a variável "distanciaMinima" recebe 'distancias' na posição do menor valor de diferenciação encontrado
                    if distanciaMinima <= limiar:# Aqui, é feito a comparação se o valor mínimo encontrado nos descitores é menor ou igual a minha margem de erro
                        nome = os.path.split(indices[minimo])[1].split("_")[0]
                        liberado = 'Acesso Liberado!'
                        corAlert = {'b': 0, 'g': 255, 'r': 0}# Aqui, estou colorindo a variável que será utilizada no retânculo de "Verde"
                    else: # caso a distância de diferenciação seja maior que a margem de erro que estipulei,
                        nome = ''
                        liberado =''
                        corAlert = {'b': 0, 'g': 0, 'r': 255}
                    result = (1 - distanciaMinima) * 100 # Aqui obtemos o resultado de acerto de cada reconhecimento, lembrando que o limiar #aceitará uma face como reconhecida se essa tiver de 50% de acerto para cima
                    if result:
                        print('{} % de certeza'.format(round(result, 2)))
                        print('chegou aqui')
                        if result >= (1 - limiar) * 100:
                            # Aqui armazeno o nome da pessoa reconhecida, se ela não for reconhecida, aqui chegará ''
                            texto = "{}".format(nome)
                            acesso = "{}".format(liberado)
                            # Aqui desenho o retângulo na tela com a cor desejada e na posição dos pontos da face.
                            cv2.rectangle(frame, (e, t), (d, b), (corAlert['b'], corAlert['g'], corAlert['r']), 2)
                            # Aqui, estou mandando esceve na tela o nome da pessoa no topo direito do retângulo.
                            cv2.putText(frame, texto, (d, t), cv2.FONT_HERSHEY_COMPLEX_SMALL, 1, (0, 255, 0))
                            cv2.putText(frame, acesso, (15, 22), cv2.FONT_HERSHEY_COMPLEX_SMALL, 2, (0, 255, 0))
                            contRecognitions+=1
                            if contRecognitions == 2:
                                time.sleep(2)
                                cap.release()
                                cv2.destroyAllWindows()
                                return '1'
                texto = "{}".format(nome)
                acesso = "{}".format(liberado) # Aqui desenho o retângulo na tela com a cor desejada e na posição dos pontos da face.
                cv2.rectangle(frame, (e, t), (d, b), (corAlert['b'], corAlert['g'], corAlert['r']), 2)
                # Aqui, estou mandando esceve na tela o nome da pessoa no topo direito do retângulo.
                cv2.putText(frame, texto, (d, t), cv2.FONT_HERSHEY_COMPLEX_SMALL, 1, (0, 255, 0))
                cv2.putText(frame, acesso, (15, 22), cv2.FONT_HERSHEY_COMPLEX_SMALL, 2, (0, 255, 0))
        # pressionou 'q', sai da aplicação.
        if cv2.waitKey(1) == ord('q'):
            cap.release()
            cv2.destroyAllWindows()
            return '0'
        cv2.imshow('reconhecimento', frame)
        count+=1
    cap.release()
    cv2.destroyWindow('reconhecimento')
    cv2.destroyAllWindows()