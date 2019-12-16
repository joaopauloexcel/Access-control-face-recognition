const express = require('express')
const router = express();
const controllerPeopleCrm = require('../controller/controllerPeopleCrm');
const cors = require('cors')

    router.options('/:id', cors()); // habilita pre-flight request para DELETE e PUT request, saber mais em: https://medium.com/@alexandremjacques/entendendo-o-cors-parte-2-e4172d6da206 
	//API ao ser requisitada com POST, executa a análise de email e username não duplicados, verifica se há a função cadastrada no 
	//banco de dados e executa o processo de cadastro no banco de dados por meio do controller e inscrição

	//Routers of notifications
	router.get('/messages', controllerPeopleCrm.getNotifs);
	router.post('/messages/:id', controllerPeopleCrm.setNotifs);
	router.post('/email', controllerPeopleCrm.sendemail);
    router.patch('/messages/:id/', cors(), controllerPeopleCrm.markMessage);

module.exports = router;