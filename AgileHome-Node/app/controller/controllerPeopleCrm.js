const db = require('../config/db.config.js');
const People = db.people;//mapeia usuário no banco de dados mysql
const Post = db.post;//Mapeia função do usuário
const Op = db.Sequelize.Op;//resposta opcional de maeamento
const tp = require('../config/email.config')
const transporter=tp.transporter
const email = tp.email
//realiza o envio notificações entre pessoas no app
exports.setNotifs = (req, res) =>{
	if(req.params.id){
		People.findOne({
            where:{
				id:req.params.id
			}
		}).then(peopleR=>{
			People.findOne({
                where:{
                    email:req.body.email
                },
            }).then(peopleE=>{
                Post.create({//Cria usuario
                    peopleEmitId: peopleE.id,
                    peopleRecepId: peopleR.id,
                    title: req.body.title,//nome recebe o que foi passado na requisição
                    text: req.body.text,
                    status: '0'
                }).then(post => {
                    res.status(200).send(post);
                }).catch(err => {//se erro de gravar usuário
                    res.status(500).send({ reason: err.message });
                })
            }).catch(err => {//se erro de gravar usuário
                res.status(501).send({ reason: err.message });
            })
		}).catch(err => {//se erro de gravar usuário
			res.status(502).send({ reason: err.message });
		})
	}
}
//realiza a leitura de notificações da pessoa recebidas
exports.getNotifs = (req, res) =>{
    if(req.query.status && req.query.search){
        People.findOne({
            where:{
                email:req.query.email
            }
        }).then(peopleR=>{
            if(!peopleR){
             return res.send('People recept not find!')
            }
            Post.findAll({
                where:{
                    peopleRecepId:peopleR.id,
                    status:req.query.status
                },
                order: [['createdAt', 'DESC']],
                attributes:['id','title', 'text', 'status', 'createdAt'],
                include:{model: People, 
                    where:{
                        name:{[Op.like]:`%${req.query.search}%`},
                    },
                     attributes:['name', 'email']}
            }).then(post=>{
             if(!post) return res.send('No notifications!')
             res.status(200).send(post)
            }).catch(err=>{
             res.status(502).send({reason: err.message})
         })
        }).catch(err=>{
            res.status(503).send({reason: err.message})
        })
	}
    else if(req.query.status){
        People.findOne({
            where:{
                email:req.query.email
            }
        }).then(peopleR=>{
            if(!peopleR){
             return
            }
            Post.findAll({
                where:{
                    peopleRecepId:peopleR.id,
                    status:req.query.status
                },
                order: [['createdAt', 'DESC']],
                attributes:['id','title', 'text', 'status', 'createdAt'],
                include:{model: People,  attributes:['name','email']}
            }).then(post=>{
             if(!post) return 
             res.status(200).send(post)
            }).catch(err=>{
             res.status(502).send({reason: err.message})
         })
        }).catch(err=>{
            res.status(503).send({reason: err.message})
        })
    } 
    else if(req.query.search){
        People.findOne({
            where:{
                email:req.query.email
            }
        }).then(peopleR=>{
            if(!peopleR){
             return res.send('People recept not find!')
            }
            Post.findAll({
                where:{
                    peopleRecepId:peopleR.id,
                },
                order: [['createdAt', 'DESC']],
                attributes:['id','title', 'text', 'status', 'createdAt'],
                include:{model: People, 
                    where:{
                        name:{[Op.like]:`%${req.query.search}%`},
                    },
                     attributes:['name', 'email']}
            }).then(post=>{
             if(!post) return res.send('No notifications!')
             res.status(200).send(post)
            }).catch(err=>{
             res.status(502).send({reason: err.message})
         })
        }).catch(err=>{
            res.status(503).send({reason: err.message})
        })
	}
    else{
        People.findOne({
            where:{
                email:req.query.email
            }
        }).then(peopleR=>{
            if(!peopleR){
             return
            }
            Post.findAll({
                where:{
                    peopleRecepId:peopleR.id,
                },
                order: [['createdAt', 'DESC']],
                attributes:['id','title', 'text', 'status','createdAt'],
                include:{model: People,  attributes:['name','email']}
            }).then(post=>{
             if(!post) return 
             res.status(200).send(post)
            }).catch(err=>{
             res.status(502).send({reason: err.message})
         })
        }).catch(err=>{
            res.status(503).send({reason: err.message})
        })
    }    
}
//marca a mensagem como lida pela pessoa que recebeu
exports.markMessage = (req, res, next) =>{
    return Post
    .findById(req.params.id)
    .then((post) => {
        if (!post) {
            res.status(404).send({
            message: 'Post Not Found',
            });
        }
        post.update({
            status:req.body.status
        }).then(post=>{
            res.status(200).send(post)
            next()
        }).catch((error) => res.status(400).send(error));
    }).catch((error) => res.status(400).send(error));
}
//realiza o envio de email pelo aplicativo
exports.sendemail = (req, res) => {
    if(req.body){
		People.findOne({//procura  no banco de dados primeiro usuario
			where: {//onde
				email: req.body.receptEmail//email corresponde ao enviado na requisição da aplicação web
			}
		}).then(people=>{
			if (!people) {//não encontrar usuário que corresponda ao email
				res.status(404).send("E-mail Not Found!")//retorna essa mensagem
				return
            }            
			const mailOptions = {
				from: `"${req.body.name}" <${email}>`,
				to: `${req.body.receptEmail}`,
				subject: `${req.body.title}`,
                html: `${req.body.text}
                <br><br>Enviado pelo usuário do e-mail: <b>${req.body.emiterEmail}</b>
                <br><br>by: Agile-Home`
			  };
	
			transporter.sendMail(mailOptions, (error, info)=>{
				if (error) {
				  console.log(error);
				  res.status(500).send(error);
				  return;
				} else {
				  console.log('Email enviado!');
				  res.send({ message: 'Send with successfully!' });
				  return;
				}
			})
		}).catch(err => {
			console.log(err)
			res.status(500).send({ reason: err.message });
			return;
		});
	}else{
		res.status(504).send('Fail -> Email does not exist!');
		return;
	}
}