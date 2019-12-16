const db = require('../config/db.config.js');
const config = require('../config/config.js');
const People = db.people;//mapeia pessoas no banco de dados mysql
const tp = require('../config/email.config')
const transporter=tp.transporter
const email = tp.email
const getRandomArbitrary = (min, max) =>{
	return Math.floor(Math.random() * (max - min) + min);
  }
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
 
exports.signin = (req, res) => {
	if(req.body.email){
		People.findOne({//procura  no banco de dados primeiro usuario
			where: {//onde
				email: req.body.email//email corresponde ao enviado na requisição da aplicação web
			}
		}).then(people => {//fará se
			if (!people) {//não encontrar usuário que corresponda ao email
				return res.status(404).send({ reason: 'People Not Found.' });//retorna essa mensagem
			}
			 // se encontrou, verificará a senha criptografada
			var passwordIsValid = bcrypt.compareSync(req.body.passwordApp, people.passwordApp);
			if (!passwordIsValid) {
				return res.status(401).send({ auth: false, accessToken: null, reason: 'Invalid Password!' });
			}
	
			var token = jwt.sign({ id: people.id }, config.secret, {//criando token com o id do usuário
				expiresIn: 1800 // expira em 1800 segundos
			});
	
			var authorities = [];//instancia variavel que armazenará as autorizações dos usuários
	
			people.getRoles().then(roles => {//
				for (let i = 0; i < roles.length; i++) {//laço de repetição do numero de registro de funções no banco de dados
					authorities.push(roles[i].name.toUpperCase());//armazena na lista cada autorização antecipadas com a string ROLE_
				}
				res.status(200).send({//Se a resposta retornar o status 200 de Ok com a leitura das funções de autorização dos usuários
					auth: true,//retorna cabeçalho de autorizacação é validado
					accessToken: token,//retorna cabeçalho de segurança da requisição recebe o token
					username: people.email,//retorna o username do usuário
					authorities: authorities//retorna a autorização do usuário
				});
			})
		}).catch(err => {
			res.status(500).send({ reason: err.message });
		});
	}else{
		res.status(504).send('Fail -> People does not exist!');
	}
}
	
exports.recoverEmail = (req, res) => {
	if(req.body.email){
		People.findOne({//procura  no banco de dados primeiro usuario
			where: {//onde
				email: req.body.email//email corresponde ao enviado na requisição da aplicação web
			}
		}).then(people=>{
			if (!people) {//não encontrar usuário que corresponda ao email
				res.status(404).send("E-mail Not Found!")//retorna essa mensagem
				return;
			}
			let newPassword = `${getRandomArbitrary(111111,999999)}`
			people.update({
				passwordApp: bcrypt.hashSync(newPassword, 8)
			})
			const mailOptions = {
				from: `"${people.name}" <${email}>`,
				to: `${people.email}`,
				subject: 'Agile Home - Solicitação de restauração de senha!',
				html: `<br>Olá <b>${people.name}</b>,<br><br>
				<p>Conforme solicitado, siga sua senha redefinida no sistema: <br><br> 
				Senha: <b>${newPassword}</b>.<br><br>
				<i>OBS: Caso não tenha sido você o solicitante dessa alteração pode ser que tentaram acessar a sua conta no aplicativo!</i>
				<br><br><br><br><b><i>Equipe - Agile Home</i></b></p>`
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
			res.status(504).send({ reason: err.message });
			return;
		});
	}else{
		res.status(505).send('Fail -> Email does not exist!');
		return;
	}
}
