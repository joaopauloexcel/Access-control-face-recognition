var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const db = require('./app/config/db.config.js');
const controllerInitiation = require('./app/controller/controllerInitiation');
const SerialPort = require("serialport");
const axios = require('axios'); //Gerenciador de APIs
const serialPort = new SerialPort("COM6", {
    baudRate: 9600 
});
const cors = require('cors')
app.use(cors());

app.use(bodyParser.json())
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'content-type');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');next();//Se ocorreu tudo certo aqui, passa pra próxima função (next funciona como um bit de trava para a função ser executada primeiro e evitar o callback)
});

db.sequelize.sync({force: false}).then(() => {
	console.log('Drop and Resync with { force: false }');
});

const loginRouter = require('./app/routers/loginRouter');
const peopleRouter = require('./app/routers/peopleRouter');
const peopleCrmRouter = require('./app/routers/peopleCrmRouter');
const accessRouter = require('./app/routers/accessRouter');
const accessResid = require('./app/routers/residRouter');
const newsResid = require('./app/routers/newsRouter');
const detectionResid = require('./app/routers/detectionRouter');
const recognitionResid = require('./app/routers/recognitionRouter');
const imageRouter = require('./app/routers/imageRouter');
var receiverData=""

app.use('/api/login', loginRouter);
app.use('/api/people', peopleRouter);
app.use('/api/peoplecrm', peopleCrmRouter);
app.use('/api/news', newsResid);
app.use('/api/access', accessRouter);
app.use('/api/resid', accessResid);
app.use('/api/detection', detectionResid);
app.use('/api/recognition', recognitionResid);
app.use('/api/image', imageRouter);

var server = app.listen(3000, ()=> {
	var host = server.address().address
	var port = server.address().port
	setTimeout(()=>{
		controllerInitiation.firstPeople()
		controllerInitiation.firstRoles()
		controllerInitiation.firstDetection()
		controllerInitiation.firstRecognition()
	},2000)
	console.log("App listening at http://%s:%s", host, port)
})

serialPort.on("open", function (req, res) { //Habilita a comunicação com a porta USB
    console.log('Communication is on!');
     
    setInterval(()=>{

      axios.get(`http://localhost:3000/api/recognition/`)
          .then(response => {
            console.log(response.data)
                  if(response.data == 0){
                    serialPort.on('data', function(data) { //Coleta os dados recebidos na porta USB e os exibe em tela
                      console.log('\nData received through USB: ' + data); 
                      console.log("dataaaaaaaaaaaaa: ",data)
                      if(data)
                      {
                        axios.put(`http://localhost:3000/api/recognition/${data}`)
                        .then(res => {
                          console.log('res aqui: ',res.data)
                           if(res.data == '1'){
                            console.log('T 1x')
                            serialPort.write('T', function(err) { //Se houve resposta da API, envia 'T' para o Arduino
                              if(err) {
                                    console.log('Erro!');
                              }
                              else {
                                console.log('T- ',response.data);
                              }
                            });
                            //res.status(200)
                           }
                          })
                          .catch(error => {
                            serialPort.write('F', function(err) { //Se não houve resposta da API, envia 'F' ao Arduino
                              if(err){
                                console.log(err.data);
                              }
                            });
                          //  res.send('Não enviou')
                          }); 
                        }
                      });   

                  }
                  else if(response.data == 2)
                  {
                    serialPort.write('L', function(err) { //Se houve resposta da API, envia 'T' para o Arduino
                    if(err) {
                          console.log('Erro!');
                    }
                    else {
                      axios.post(`http://localhost:3000/api/recognition/`, {"id":1})
                        .then(response => {
                             console.log('Zerou')
                          })
                          .catch(error => {
                           console.log('deu ruim')
                          //  res.send('Não enviou')
                          });
                    }
                  });
                  }
                }
            )
          .catch(error => {
            serialPort.write('F_receiverData', function(err) { //Se não houve resposta da API, envia 'F' ao Arduino
              if(err) {
                console.log(err.data);
              }
            });
          //  res.send('Não enviou')
          });    

    },1000) 
});

module.exports = app;