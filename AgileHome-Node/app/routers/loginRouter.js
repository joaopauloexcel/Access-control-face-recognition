const express = require('express')
const router = express();
const controllerLogin = require('../controller/controllerLogin.js');//controller recebe todo o arquivo do controlador js que contém o endpoint de cadastro e e acesso do usuário no sistema

	//API ao ser requisitada com POST, executa o processo de login do controller de login do usuário ao acesso do sistema

	//Router of Login
	router.post('/signin', controllerLogin.signin);

	//Router of Recover password
	router.post('/recemail', controllerLogin.recoverEmail);
	
module.exports = router;