const db = require('../config/db.config.js');
const News = db.news;//mapeia usuário no banco de dados mysql
const People = db.people;

const Op = db.Sequelize.Op;//resposta opcional de maeamento

exports.list = (req, res) => {
	if(req.query.search){
		return News
        .findAll({ 
            where: {
                text:{[Op.like]:`%${req.query.search}%`}
            },
            order: [['dateTime', 'DESC']],
            include:{model: People,  attributes:['name']}
        })
        .then((news) => {
        if (!news) {
            return res.status(404).send({message: 'News Not Found'})
            }
        return res.status(200).send(news);
        }).catch((error) => res.status(400).send(error));
	}
	else{
		return News.
		findAll({
            attributes:['id','text', 'dateTime'],
            order: [['dateTime', 'DESC']],
            include:{model: People,  attributes:['name']}
		})
		.then((news) => res.status(200).send(news))
		.catch((error) => { res.status(400).send(error); });
	}	  
}

exports.add = (req, res) => {//cadastro de usuários
    if(req.body.userEmail){
        var dNow = new Date();
        dNow = dNow.getDate() + '/' + (dNow.getMonth()+1) + '/' +
        dNow.getFullYear() + ' ' + dNow.getHours() + ':' + 
        dNow.getMinutes();	    
        People
        .findOne({
            where:{
                email:req.body.userEmail
            }
        })
        .then(people=>{
            News.create({//Cria usuario
                peopleId: people.id,
                text:req.body.text,
                dateTime:dNow
            }).then(access => {
                res.status(200).send(access)
            }).catch(err => {//se erro de gravar usuário
                res.status(500).send({ reason: err.message });
            })
        })
        .catch(err => {//se erro de gravar usuário
                res.status(500).send({ reason: err.message })
            })   
    }else return
}
    exports.update = (req, res) => {//cadastro de usuários
        var dNow = new Date();
        dNow = dNow.getDate() + '/' + (dNow.getMonth()+1) + '/' +
        dNow.getFullYear() + ' ' + dNow.getHours() + ':' + 
        dNow.getMinutes();
        News
        .findById(req.params.id)
        .then(news=>{
            news.update({//Cria usuario
                text:req.body.text,
                dateTime:dNow
            }).then(news => {
                res.status(200).send(news)
            }).catch(err => {//se erro de gravar usuário
                res.status(500).send({ reason: err.message });
            })
        })
        .catch(err => {//se erro de gravar usuário
                res.status(500).send({ reason: err.message })
            })   
    }  

exports.delete = (req, res) => {
    return News
      .findById(req.params.id)
      .then(news => {
        if (!news) {
          return res.status(400).send({
            message: 'News Not Found',
          });
        }
		return news
		.destroy()
          .then(() => res.status(200).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  }