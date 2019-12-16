const db = require('../config/db.config.js');
const Recognition = db.recognition;//mapeia usuário no banco de dados mysql
const People = db.people;
const Access = db.access;

const Op = db.Sequelize.Op;
var tents=0

//Recebe identificação da pessoa pelo arduino e verifica se a pessoa está ativa e se a senha existe
//dando tudo certo, armazenará na tabela de reconhecimento o status 1 e o id da pessoa
//Caso não tenha chegado nada pelo arduino e haja uma equisição de alteração, será por conta do fechamento
//do reconhecimento facial, onde os campos peopleId e status recebem nulo.
exports.getFace = (req, res) => {
    Recognition
    .findById(1)
    .then((recognition) => {
    if (!recognition) 
    {
        res.status(404).send('Not Set');
    }
        res.status(200).send(recognition.status);
    })
    .catch((error) => res.status(400).send("Deu ruim"));
}

exports.setFace = (req, res) => {//Pelo Arduino e fechamento do reconhecimento no python
    Recognition.findById(1)
    .then(recognition=>{
        recognition.update({
            peopleId:null,
            status:0
        }).then(recognition=>{
            res.status(200).send('Face of recognition modify for 0!')
        }).catch(err=>{
            res.status(500).send('Erro ao tentar alterar')
        })
     }
    ).catch(err=>{
        res.status(500).send('Erro ao tentar localizar pessoa!')
    })

}


exports.updateFace = (req, res) => {//Pelo Arduino e fechamento do reconhecimento no python
    People.findById(req.params.id)
    .then(people=>{
        people.update({
            faces:'0'
        }).then(people=>{
            res.status(200).send('Face of recognition modify!')
        }).catch(err=>{
            res.status(500).send('Erro ao tentar alterar')
        })
     }
    ).catch(err=>{
        res.status(500).send('Erro ao tentar localizar pessoa!')
    })

}

exports.updateNameStatus = (req, res) => {//Pelo Arduino e fechamento do reconhecimento no python
    if(req.params.id){//a senha da pessoa que vem no parâmetro
        People.findOne({
            where:{
                 passwordHome:req.params.id,
             }
         }).then(people=>{
                if(people.situation!=0){//se está ativo
                    if(people.faces!=0){//então, se tive face, habilita reconhecimento facial
                        Recognition.findById(1)
                        .then(recognition => {
                                recognition.update({//Cria usuario
                                    peopleId: people.id,//nome recebe o que foi passado na requisição
                                    status: 1,
                                }).then(recognition => {
                                        tents=0//zera tentativas erradas
                                        return res.status(200).send('1')
                                        //console.log('Recognition activate', people.name)
                                    })
                                    .catch(err => {//se erro de gravar usuário
                                        return res.status(500).send({ reason: err.message });
                                    })
                            }).catch(err => {//se erro de gravar usuário
                                return res.status(500).send({ reason: err.message });
                            })
                    }
                    else{
                        tents=0//zera tentativas erradas
                        res.status(200).send('S/face \ncadastrada!')
                    }
                }
                else{
                    var dNow = new Date();
                    dNow = dNow.getDate() + '/' + (dNow.getMonth()+1) + '/' +
                    dNow.getFullYear() + ' ' + dNow.getHours() + ':' + 
                    dNow.getMinutes();	
                        Access.create({//Cria usuario
                            peopleId: people.id,//nome recebe o que foi passado na requisição
                            status: '0', //0 negado - 1 liberado
                            dateTime:dNow
                        }).then(access => {
                            tents=0//zera tentativas erradas
                            res.status(200).send('Acesso negado!\nVá à recepção!')
                        }).catch(err => {//se erro de gravar usuário
                            tents=0//zera tentativas erradas
                            res.status(500).send({ reason: err.message });
                        })
                }
        }).catch(err => {
               tents++
               if(tents<3){
                res.status(200).send('Senha inválida!\nErrou '+tents+'/3')
           }
               if(tents==3){
                    res.status(200).send('Errou! Uma foto\nsua foi tirada!')
                    tents=0//zera tentativas erradas
               }   
            })
    } 
    else {
        Recognition.findById(1)
        .then(recognition=>{
            recognition.update({
                peopleId: null,//nome recebe o que foi passado na requisição
                status: 0
            }).then(recognition=>{
                res.status(200).send('Status of recognition modify null!')
            }).catch(err => {//se erro de gravar usuário
                res.status(500).send({ reason: err.message });
              })
        }).catch(err => {//se erro de gravar usuário
            res.status(500).send({ reason: err.message });
          })
    }
}