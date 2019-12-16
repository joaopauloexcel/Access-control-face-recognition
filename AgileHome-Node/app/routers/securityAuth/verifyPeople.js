const db = require('../../config/db.config.js');//carrega configurações do banco de dados
const config = require('../../config/config.js');//carrega configuração do usuário
const ROLEs = config.ROLEs;//carrega Funções dos usuários
const People = db.people;//declara conexão com o banco de dados com a tabela de usuários
const Op = db.Sequelize.Op;//Operadores do sequelize

var bcrypt = require('bcryptjs');

checkDuplicateEmail = (req, res, next) => {// -> Verifica se usuário existe no banco de dados
		// -> Senão, se o usuário tiver o login pelo email, verifica se o campo email já existe no banco de dados
		People.findOne({//Tenta encontrar usuário
			where: {//onde
				email: req.body.email,//email do banco de dados corresponde ao e-mail da requisição enviada da aplicação web tentando o cadastro
				id:{[Op.ne]: req.body.id}				
			}
		}).then(people => {//faça
			if (people) {//se houver usuário já cadastrado com esse email
				res.status(400).send("Fail -> Email is already in use!");//retorna mensagem 
				return;
			}

			next();//caso contrário, passa para a próxima função
		});
}

checkDupliPswdHome = (req, res, next) => {// -> Verifica se algum usuário com essa mesma senha já existe no banco de dados
	People.findOne({//Tenta encontrar usuário
		where: {//onde
			passwordHome: req.body.passwordHome,
			id:{[Op.ne]: req.body.id}		
		}
	}).then(people => {//faça
		if (people) {//se houver usuário já cadastrado com esse password
			res.status(400).send("Fail -> Password is already in use!");//retorna mensagem 
			return;
		}

		next();//caso contrário, passa para a próxima função na rota
	});
}

checkRolesExisted = (req, res, next) => {//função que verifica se as funções de autorização do usuário existem no banco de dados
	for (let i = 0; i < req.body.roles.length; i++) {//contador com tamanho das funções trazidas no corpo da requisição
		if (!ROLEs.includes(req.body.roles[i].toUpperCase())) {//Se nas funções dos usuários do banco de dados não existe a que está vindo do cadasto do usuário da requisição
			res.status(400).send("Fail -> Does NOT exist Role = " + req.body.roles[i]);//retorna mensagem dizendo que tal função de autorização não existe cadastrada
			return;
		}
	}
	next();//caso contrário, passa para a próxima função
}

const signUpVerify = {};//declaração e instanciação da variável objeto que verificará se usuário já está logado
signUpVerify.checkDuplicateEmail = checkDuplicateEmail;//novo atributo do objeto que recebe a verificação do usuário
signUpVerify.checkRolesExisted = checkRolesExisted;//novo atributo do objeto que recebe a verificação das funções de autorização do usuário
signUpVerify.checkDupliPswdHome = checkDupliPswdHome//Verifica se password da casa já existe para alguém.

module.exports = signUpVerify;//exportação da variável de verificação usuário/FUNÇÃO para outros arquivos dentro do projeto