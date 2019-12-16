import cv2
import os
import glob #serve para percorrer uma pasta
import _pickle as cPickle
import dlib
import numpy as np

def treino(identify):
        detectorFace = dlib.get_frontal_face_detector()  # detector de faces
        detectorPontos = dlib.shape_predictor("recursos/shape_predictor_68_face_landmarks.dat")  # detector de pontos faciais rede neural convulacional
        reconhecimentoFacial = dlib.face_recognition_model_v1("recursos/dlib_face_recognition_resnet_model_v1.dat")  # variavel para o reconhecimento facial
        descritoresFaciais = None
        indice = {}
        idx = 0
        for arquivo in glob.glob(
           os.path.join("fotos/treinamento", "*.jpg")):  #aqui pega foto por foto da pasta "treinamento"
           imagem = cv2.imread(arquivo)#imagem recebe a foto aqui detectamos todas as faces
           facesDetectadas = detectorFace(imagem, 1)  # detecta as faces da foto e salva em facesDetectadas
           numeroFacesDetectadas = len(facesDetectadas)  # numero de faces detectadas
           if numeroFacesDetectadas > 1:  # dlib se perde com mais de uma face na imagem para treinamento
               print("Há mais de uma face na imagem {}".format(arquivo))
               return '0'
           elif numeroFacesDetectadas < 1:  # se nenhuma face estiver no arquivo de treinamento
               print("Nenhuma face encontrada no arquivo {}".format(arquivo))
               return '0'
           for face in facesDetectadas:  # aqui percorremos cada face para pegar os pontos faciais percorrer a matriz de faces
               pontosFaciais = detectorPontos(imagem, face)  # aqui pegamos os pontos faciais detecta os pontos faciais
               descritorFacial = reconhecimentoFacial.compute_face_descriptor(imagem, pontosFaciais)#aqui pegamos o array com 128 pontos da face por meio de uma função que já tem no dlib.
               listaDescritorFacial = [df for df in descritorFacial] # Aqui geramos uma lista dos descritores faciais, contendo informações da matriz de caracteristicas de acda face
               npArrayDescritorFacial = np.asarray(listaDescritorFacial, dtype=np.float64)# aqui convertemos ele para o formato do numpy para gerar os arquivos na pasta "recursos"
               npArrayDescritorFacial = npArrayDescritorFacial[np.newaxis, :]# até aqui a dimensão do array é 128, precisamos que tenha 1x128,
               print(npArrayDescritorFacial)
               if descritoresFaciais is None: #Se ainda não tenho informa~çoes no descitoresFaciais
                    descritoresFaciais = npArrayDescritorFacial #recebe o primeiro array de uma face
               else: #caso contrário, no mesmo arquivo irá concatenar informações de outras faces.
                    descritoresFaciais = np.concatenate((descritoresFaciais, npArrayDescritorFacial),axis=0)
               indice[idx] = arquivo # Guarda na lista de indices as informação de cada foto (caminho + nome do arquivo.jpg)
               idx += 1 # incrementa o indice da lista de imagens treinadas
        np.save("recursos/descritores_{}.npy".format(identify), descritoresFaciais)
        with open("recursos/indices_{}.pickle".format(identify), 'wb') as f:#aqui, é aberto o arquivo indices para armazenas os índices das faces treinadas de determinada pessoa, se ele não existe, é criado.
           cPickle.dump(indice, f)