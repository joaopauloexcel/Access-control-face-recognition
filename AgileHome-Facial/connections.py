import mysql.connector, time
from unicodedata import normalize
import threading
import deteccaoFacial
import reconhecimentoFacial
from datetime import datetime

print_lock = threading.Lock()#reserva acesso único
lock = threading.Lock()#reserva acesso único
original_print = print

def print(*args, **kw):
   with print_lock:
      original_print(*args, **kw)

def delete_acentos(txt): #função que remove acentos dos nomes
   return normalize('NFKD', txt).encode('ASCII', 'ignore').decode('ASCII')

def getStatusDetectionsRecognitions(): #Lê status de detecção / nome e identify
    while True:
        # Consulta banco de dados para o status de reconhecimento ativado
            lock.acquire()
            sql_statement = 'SELECT peopleId FROM recognitions where status = 1'
            db_connection = mysql.connector.connect(host="",user="",passwd="",database="")
            my_database = db_connection.cursor()
            my_database.execute(sql_statement)
            output = my_database.fetchall()
            if output:  # se houve alteração do status,
                if getPeopleRecognitions(output[0][0], my_database):  # executa função de encontrar a pessoa
                    now = datetime.now()
                    dateTime = "{}/{}/{} {}:{}".format(now.day, now.month, now.year, now.hour, now.minute)
                    addAccess(output[0][0], dateTime, '1')
            else:
                print('Reconhecimento status = 0')
            my_database.close()
            db_connection.close()
            lock.release()
            time.sleep(0.3)
            lock.acquire() # Consulta banco de dados para o status de detecção ativado
            sql_statement = 'SELECT peopleId FROM detections where status = 1'
            db_connection = mysql.connector.connect(host="",user="",passwd="",database="")
            my_database = db_connection.cursor()
            my_database.execute(sql_statement)
            output = my_database.fetchall()
            if output: # se houve alteração do status,
                getPeopleDetect(output[0][0],my_database) # executa função de encontrar a pessoa
            else:
                print('Detecção status = 0')
            my_database.close()
            db_connection.close()
            lock.release()
            time.sleep(0.3)

def getPeopleDetect(peopleId,my_database):# lê pessoas e busca por nome e indentificação
    sql_statement = 'SELECT name, passwordHome FROM peoples where id = {}'.format(peopleId)
    my_database.execute(sql_statement)
    output = my_database.fetchall()
    if output:
        name = delete_acentos('{}'.format(output[0][0]))
        identify = output[0][1]
        print(name, identify)
        deteccaoFacial.deteccaoTreinamento(3,peopleId,name, identify)
        updateDetections()

def getPeopleRecognitions(peopleId,my_database):# lê pessoas e busca por nome e indentificação
    sql_statement = 'SELECT id, passwordHome FROM peoples where id = {}'.format(peopleId)
    my_database.execute(sql_statement)
    output = my_database.fetchall()
    if output:
        id = output[0][0]
        identify = output[0][1]
        print(identify)
        if reconhecimentoFacial.reconhecimentoFacial(id, identify)=='1':
            now = datetime.now()
            dateTime = "{}/{}/{} {}:{}".format(now.day, now.month, now.year, now.hour, now.minute)
            addAccess(output[0][0], dateTime, '1')
            updateRecognitions2()
        elif reconhecimentoFacial.reconhecimentoFacial(id, identify)=='0':
            updateRecognitions0()
        else:
            updateRecognitions0()

def addAccess(peopleId, dateTime, status):#Adiciona novo acesso no banco de dados após reconhecimento
    sql_statement = "INSERT INTO accesses (peopleId,dateTime,status) values(%s,%s,%s)"
    values = ("{}".format(peopleId),"{}".format(dateTime),"{}".format(status))
    db_connection = mysql.connector.connect(host="",user="",passwd="",database="")
    my_database = db_connection.cursor()
    my_database.execute(sql_statement,values)
    db_connection.commit()
    my_database.close()
    db_connection.close()

def updateRecognitions2(): #Atualiza tabela de reconhecimento normalizando-a
    sql_statement = "UPDATE recognitions SET peopleId=null, status=2 where id=1"
    db_connection = mysql.connector.connect(host="",user="",passwd="",database="")
    my_database = db_connection.cursor()
    my_database.execute(sql_statement)
    db_connection.commit()
    my_database.close()
    db_connection.close()

def updateRecognitions0(): #Atualiza tabela de reconhecimento normalizando-a
    sql_statement = "UPDATE recognitions SET peopleId=null, status=0 where id=1"
    db_connection = mysql.connector.connect(host="",user="",passwd="",database="")
    my_database = db_connection.cursor()
    my_database.execute(sql_statement)
    db_connection.commit()
    my_database.close()
    db_connection.close()

def updateDetections(): #Atualiza tabela de detecção normalizando-a
    sql_statement = "UPDATE detections SET peopleId=null, status=0 where id=1"
    db_connection = mysql.connector.connect(
        host="",user="",passwd="",database="")
    my_database = db_connection.cursor()
    my_database.execute(sql_statement)
    db_connection.commit()
    my_database.close()
    db_connection.close()

def updatePeopleFace(peopleId): #Atualiza tabela de detecção normalizando-a
    sql_statement = "UPDATE peoples SET faces=1 where id={}".format(peopleId)
    db_connection = mysql.connector.connect(host="",user="",passwd="",database="")
    my_database = db_connection.cursor()
    my_database.execute(sql_statement)
    db_connection.commit()
    my_database.close()
    db_connection.close()