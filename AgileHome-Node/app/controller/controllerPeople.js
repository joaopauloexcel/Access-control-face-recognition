const db = require('../config/db.config.js');
const People = db.people;//mapeia usuário no banco de dados mysql
const Role = db.role;//Mapeia função do usuário

const Op = db.Sequelize.Op;//resposta opcional de maeamento

var bcrypt = require('bcryptjs');

exports.list = (req, res) => {
	if(req.query.search){
		if(req.query.role==""){
			return People
		.findAll({ 
			where: {
				[Op.or]:[
					{name:{[Op.like]:`%${req.query.search}%`}},
					{email:{[Op.like]:`%${req.query.search}%`}}
				],
			}
		})
		.then((people) => {
		  if (!people) {
			  return res.status(404).send({message: 'People Like Not Found'})
			}
		  return res.status(200).send(people);
		}).catch((error) => res.status(400).send(error));
		}
		return People
		.findAll({ 
			where: {
				[Op.or]:[
					{name:{[Op.like]:`%${req.query.search}%`}},
					{email:{[Op.like]:`%${req.query.search}%`}}
				],
			},
			include:{model: Role,  
				where:{
					name:req.query.role
				},
				  attributes:['name']
				},
			order: [['name', 'ASC']]
		})
		.then((people) => {
		  if (!people) {
			  return res.status(404).send({message: 'People Like Not Found'})
			}
		  return res.status(200).send(people);
		}).catch((error) => res.status(400).send(error));
	}
	else if(req.params.id){
			return People
			.findById(req.params.id)
			.then((people) => {
			if (!people) {
				return res.status(404).send({
				message: 'People Not Found',
				});
			}
			return res.status(200).send(people);
			})
			.catch((error) => res.status(400).send(error));
		}
	else if(req.query.role ==""){
		return People
			.findAll().then(peoples =>{
				res.status(200).send(peoples)
			}).catch(error=>{
				res.status(404).send('Peoples Not found')
			})
	    }
		else{
			return People
			.findAll({
				include:{model: Role,  
					where:{
						name:req.query.role
					},
					  attributes:['name']
					},
			}).then(peoples =>{
				res.status(200).send(peoples)
			}).catch(error=>{
				res.status(404).send('Peoples Not found')
			})
		}	  
}

exports.getRole = (req, res) => {
	People.findById(req.params.id)
		.then(people => {
			people.getRoles().then(roles => {
				for(let i=0; i<roles.length; i++){
					console.log(roles[i].name);
					if(roles[i].name.toUpperCase() === "ADMIN"){
						return res.status(200).send({role: roles[i].name.toLowerCase()})
					}
					else if(roles[i].name.toUpperCase() === "USER"){
					     	return res.status(200).send({ role: roles[i].name.toLowerCase()})
					}
					else if(roles[i].name.toUpperCase() === "RESIDENT"){
						return res.status(200).send({ role: roles[i].name.toLowerCase()})
			        }
				}
				
				res.status(403).send("Role not find!");
				return;
			}).catch((error) => { res.status(400).send(error); });
		}).catch((error) => { res.status(400).send(error); });
}

exports.add = (req, res) => {//cadastro de usuários
	// Save People to Database
		People.create({//Cria usuario
			name: req.body.name,//nome recebe o que foi passado na requisição
			email: req.body.email,
			street: req.body.street,
			zipCode: req.body.zipCode,
			state: req.body.state,
			nStreet: req.body.nStreet,
			complement: req.body.complement,
			hood: req.body.hood,
			city: req.body.city,
			situation: req.body.situation,
			faces:0,
			passwordHome: req.body.passwordHome,//"", senha é criptografada
			passwordApp: bcrypt.hashSync(req.body.passwordApp, 8)
		}).then(people => {
			Role.findAll({//procura todas as funções
				where: {//onde
					name: {//campo nome
						[Op.or]: req.body.roles//seja igual ao atribuido a alguma função
					}
				}
			}).then(roles => {//se retornou algum role
				people.setRoles(roles).then(() => {
					res.send({ message: 'Registered successfully!' });
				});
			}).catch(err => {//se erro de role
				res.status(502).send({ reason: err.message });
			});
		}).catch(err => {//se erro de gravar usuário
			res.status(501).send({ reason: err.message });
		})
}

exports.update = (req, res) => {//cadastro de usuários
	// Save People to Database
	People.findById(req.params.id)
      .then(people => {
	   people.update({//Cria usuario
		name: req.body.name,//nome recebe o que foi passado na requisição
		email: req.body.email,
		street: req.body.street,
		zipCode: req.body.zipCode,
		state: req.body.state,
		nStreet: req.body.nStreet,
		complement: req.body.complement,
		hood: req.body.hood,
		city: req.body.city,
		situation: req.body.situation,
		passwordHome: req.body.passwordHome,//"", senha é criptografada
		passwordApp: bcrypt.hashSync(req.body.passwordApp, 8)
	}).then(people => {
		Role.findAll({//procura todas as funções
			where: {//onde
				name: {//campo nome
					[Op.or]: req.body.roles//Op OR no qual seja igual a um ou outro atribuido a alguma função
				}
			}
		}).then(roles => {//se retornou algum role
			people.setRoles(roles).then(() => {
				res.send({ message: 'Registered successfully!' });
			});
		}).catch(err => {//se erro de role
			res.status(500).send({ reason: err.message });
		});
	}).catch(err => {//se erro de gravar usuário
		res.status(500).send({ reason: err.message });
	})
 })
}

exports.delete = (req, res) => {
    return People
      .findById(req.params.id)
      .then(people => {
        if (!people) {
          return res.status(400).send({
            message: 'People Not Found',
          });
        }
		return people
		.destroy()
          .then(() => res.status(200).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  }