const express = require('express')
const router = express();
const verifySignUp = require('./securityAuth/verifyPeople');//importa export do arquivo de análise de usuário duplicado verifySignUp.js
const authJwt = require('./securityAuth/verifyJwtToken');//
const controllerPeople = require('../controller/controllerPeople');//controller recebe todo o arquivo do controlador js que contém o endpoint de cadastro e e acesso do usuário no sistema
const cors = require('cors')

    router.options('/:id', cors()); // habilita pre-flight request para DELETE e PUT request, saber mais em: https://medium.com/@alexandremjacques/entendendo-o-cors-parte-2-e4172d6da206 
	//API ao ser requisitada com POST, executa a análise de email e username não duplicados, verifica se há a função cadastrada no 
	//banco de dados e executa o processo de cadastro no banco de dados por meio do controller e inscrição
	
	//Routes of CRUD
	//router.get('/:id?', /*[authJwt.verifyToken]*/ controllerPeople.list);
	router.get('/:id?', /*[authJwt.verifyToken]*/ controllerPeople.list);
	router.post('/', [verifySignUp.checkDuplicateEmail, verifySignUp.checkDupliPswdHome], controllerPeople.add);
	router.put('/:id', cors(), [verifySignUp.checkDuplicateEmail, verifySignUp.checkDupliPswdHome], controllerPeople.update);
	router.delete('/:id', cors(), controllerPeople.delete);

    //Router of permissions
	router.get('/roles/:id', controllerPeople.getRole);


module.exports = router;