const express = require('express')
const router = express();
const controllerResid = require('../controller/controllerResidFilter')

router.get('/', /*[authJwt.verifyToken]*/ controllerResid.listSituation);

module.exports = router;