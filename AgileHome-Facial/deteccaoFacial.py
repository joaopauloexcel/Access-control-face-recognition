import cv2
import os
import dlib
import treinamento as treino #importando o arquivo treinamento para ser chamado aqui
import connections

# Método que fará a exclusão das fotos da pasta "treinamentos" após as mesmas já terem sidos treinadas
def deleteFotos():
    pasta = "fotos/treinamento"
    diretorio = os.listdir(pasta)
    for arquivo in diretorio:
        os.remove('{}/{}'.format(pasta, arquivo)) #remove foto por foto

# Método para tirar a foto da pessoa detectando-a e treinando-a
def deteccaoTreinamento(totalfotos, peopleId, pessoaNome, pessoaIdentify):
    cap = cv2.VideoCapture(1)  # habilita webcan
    detector = dlib.get_frontal_face_detector()#detector frontal de faces já incluso no dlib
    fhotos = 0 #contador de fotos já tiradas
    count=0
    while True:
        ret, frames = cap.read() #chama a leitura da captura da webcam
        frame = cv2.resize(frames, (500, 360))
        frame = cv2.flip(frame, 2) #mantém um padrão de espelhamento da imagem, pois cada webcam pode espelhar a imagem de um jeito
        cv2.putText(frame, "Foto {}/{}".format(fhotos + 1, totalfotos), (0, 20), cv2.FONT_HERSHEY_COMPLEX_SMALL, 1,(0, 255, 255))# escreve na tela a quantidade de fotos já tiradas pelo total a tirar
        k = cv2.waitKey(100) #aguarda usuário digitar algo
        if k == 27: #se digitar ESC sai
             cap.release()
             cv2.destroyAllWindows()
             return
        if(count%50==0):
            frameCinza = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)  # passa imagem para tom de cinza
            facesDetectadas = detector(frameCinza, 1)  # aplica imagem em cinza no detector de faces do dlib para melhor detecção
            if facesDetectadas: # se detectou alguma face
                cv2.imwrite("fotos/treinamento/{}_{}_{}.jpg".format(pessoaNome, pessoaIdentify, fhotos + 1), frame)#Armazenará foto na pasta 'treinamento'
                fhotos += 1 #incrementará uma foto tirada
                if fhotos == totalfotos: #se atingiu o total de fotos tiradas
                    treino.treino(pessoaIdentify) #chama a função de treinamento para gerar os descritores e indices da imagem
                    connections.updatePeopleFace(peopleId)
                    deleteFotos()#chama função para excluir fotos da pasta após treinadas
                    cap.release()
                    cv2.destroyAllWindows()
                    return
        cv2.imshow('Deteccao', frame) #abre na tela a visualização da webcam
        count+=1
    cap.release()
    cv2.destroyWindow('Deteccao')
    cv2.destroyAllWindows()

#chamando método
#deteccaoTreinamento(5, 'joao', '123')