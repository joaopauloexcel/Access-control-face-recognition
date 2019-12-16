const db = require('../config/db.config.js');
const Image = db.image;//mapeia usuário no banco de dados mysql
const People = db.people;
const fs = require('fs');
const Op = db.Sequelize.Op;//resposta opcional de maeamento

exports.list = (req, res) => {
    if(req.params.id){
        Image.findOne({
            where:{
                peopleId:req.params.id
            },
            attributes:['data']
        }).then(image=>{
            res.status(200).send(image)
        }).catch(err=>{
            res.status(404).send('Image Not Found')
        })
    }
    else{
        Image.findAll({
            attributes:['peopleId','data']
        }).then(image=>{
            res.status(200).send(image)
        }).catch(err=>{
            res.status(404).send('Image Not Found')
        })
    }      
}

exports.add = (req, res) => {
    if(req.body.id){
        var imageData = fs.readFileSync('./j.PNG');
        Image.create({
            peopleId:req.body.id,
            data: imageData
          }).then(image => {
            try{
              fs.writeFileSync('j.PNG', image.data);  
              res.status(200).send('IMG Cadastrada com sucesso!')      
            }catch(e){
              console.log(e);
            }
          }).catch(err=>{
              res.status(405).send('Deu ruim!')
          })
    }
    else res.status(404).send('Photo People not Found')
}
