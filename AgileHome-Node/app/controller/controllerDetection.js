const db = require('../config/db.config.js');
const Detection = db.detection;//mapeia usuário no banco de dados mysql
const People = db.people;

const Op = db.Sequelize.Op;//resposta opcional de maeamento

/*Alteração que será sempre acionada pelo aplicativo e aplicação Web*/ 
exports.updateNameStatus = (req, res) => {
    if(req.params.id && req.query.identify){//se tem id e identify (acionada pela aplicação web)
        People.findOne({
            where:{
                passwordHome:req.query.identify
             }
         }).then(people=>{
            Detection.findById(1)
            .then(detection => {
                detection.update({//Cria usuario
                        peopleId: people.id,//nome recebe o que foi passado na requisição
                        status: 1,
                    }).then(recognition => {
                            res.send('Status of recognition modify!')
                        })
                        .catch(err => {//se erro de gravar usuário
                            res.status(500).send({ reason: err.message });
                        })
                }).catch(err => {//se erro de gravar usuário
                      res.status(502).send({ reason: err.message });
                   })
        }).catch(err => {//se erro de gravar usuário
              res.status(503).send({ reason: err.message });
            })
    } 
    else if(!req.params.id && req.query.identify){//se não tem parametro mas tem identify (detecção finalizada)
        Detection.findById(1)
        .then(detection=>{
            detection.update({
                peopleId: null,//nome recebe o que foi passado na requisição
                status: 0
            }).then(detection=>{
                People.findOne({
                    where:{
                        passwordHome:req.query.identify
                    }
                }).then(people=>{
                    people.update({
                        face:1  //altera campo face da pessoa para 1.
                    }).then(people=>{
                        res.status(200).send('Ok')
                    }).catch(err => {//se erro de gravar usuário
                        res.status(450).send({ reason: err.message });
                      })
                }).catch(err => {//se erro de gravar usuário
                      res.status(451).send({ reason: err.message });
                    })
            }).catch(err => {//se erro de gravar usuário
                  res.status(452).send({ reason: err.message });
               })
        }).catch(err => {//se erro de gravar usuário
               res.status(453).send({ reason: err.message });
           })
    }
    else if(!req.params.id && !req.query.identify){ //se não veio identify, apenas deixa a tabela de detecção como nula
        Detection.findById(1)
        .then(detection=>{
            detection.update({
                peopleId: null,//nome recebe o que foi passado na requisição
                status: 0
            }).then(detection=>{
                res.status(200).send('set of null')
            }).catch(err => {//se erro de gravar usuário
                res.status(400).send({ reason: err.message });
              })
        }).catch(err => {//se erro de gravar usuário
            res.status(401).send({ reason: err.message });
          })
    }
}