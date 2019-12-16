const db = require('../config/db.config.js');
const People = db.people;//mapeia usuário no banco de dados mysql
const Role = db.role;//Mapeia função do usuário

exports.listSituation = (req, res) => {
	if(req.query.situation){
		return People
		.findAll({ 
			where: {
					situation:req.query.situation,
			},
			attributes:['name'],
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
	else return
}