const express = require('express')
const router = express();
const controllerAccess = require('../controller/controllerAccess');//controller recebe todo o arquivo do controlador js que contém o endpoint de cadastro e e acesso do usuário no sistema
const cors = require('cors')

    router.options('/:id', cors());
	//API ao ser requisitada com POST, executa o processo de login do controller de login do usuário ao acesso do sistema

	//Router of Login
    router.get('/', controllerAccess.list);
    router.get('/report', controllerAccess.pdf);
    router.post('/:id', controllerAccess.add);
    router.delete('/:id', cors(), controllerAccess.delete);
	
module.exports = router;