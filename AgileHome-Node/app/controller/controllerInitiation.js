const db = require('../config/db.config.js');
const People = db.people;//mapeia usuário no banco de dados mysql
const Role = db.role;//Mapeia função do usuário
const Detection = db.detection;//Mapeia função do usuário
const Recognition = db.recognition;//Mapeia função do usuário
var bcrypt = require('bcryptjs');
const Op = db.Sequelize.Op;//resposta opcional de maeamento

exports.firstRoles = ()=> {
	Role.findById(1)
	.then(role=>{
		if(!role){
			Role.create({
				id: 1,
				name: "ADMIN"
			});
			Role.create({
				id: 2,
				name: "USER"
			});
			Role.create({
				id: 3,
				name: "RESIDENT"
			});
		}
	}).catch(err => {//se erro de role
		return
	});
}

exports.firstPeople = () => {
	People.findById(1)
			.then(people => {
				if(people)
					return console.log('ja existe')
			    else{
					People.create({
						id: 1,
						name: "Admin",
						email:"admin@admin.com",
						passwordHome: 123,
						passwordApp: bcrypt.hashSync('123456', 8),//"", senha é criptografada
						situation: '1',
						faces: '0'
					}).then(people => {
						Role.findAll({//procura todas as funções
							where: {//onde
								name: 'ADMIN'
							}
						}).then(roles => {//se retornou algum role
							people.setRoles(roles).then(() => {
								console.log('OK')
							});
						}).catch(err => {//se erro de role
							console.log(err)
						});
					}).catch(err => {//se erro de gravar usuário
						return
					})
		     	}
			})
			.catch((error) => {return});
}

exports.firstDetection = ()=> {
	Detection.findById(1)
	.then(detection=>{
		if(!detection){
			Detection.create({
				id: 1,
				peopleId: null,
				status:0
			});
		}
	}).catch(err => {//se erro de role
		return err
	});
}

exports.firstRecognition = ()=> {
	Recognition.findById(1)
	.then(recognition=>{
		if(!recognition){
			Recognition.create({
				id: 1,
				peopleId: null,
				status:0
			});
		}
	}).catch(err => {//se erro de role
		return err
	});
}