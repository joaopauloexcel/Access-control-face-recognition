const express = require('express')
const router = express();
const controllerNews = require('../controller/controllerNews');//controller recebe todo o arquivo do controlador js que contém o endpoint de cadastro e e acesso do usuário no sistema
const cors = require('cors')

    router.options('/:id', cors());
	//API ao ser requisitada com POST, executa o processo de login do controller de login do usuário ao acesso do sistema

	//Router of Login
    router.get('/', controllerNews.list);
    router.post('/', controllerNews.add);
    router.put('/:id', cors(), controllerNews.update);
    router.delete('/:id', cors(), controllerNews.delete);
	
module.exports = router;