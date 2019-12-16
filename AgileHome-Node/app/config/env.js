const env = {//responsável pela conexão com o banco de dados Mysql
  database: '',
  username: '',
  password: '',
  host: '',
  dialect: '',
  pool: {
	  max: 5,
	  min: 0,
	  acquire: 30000,
	  idle: 10000
  }
};
 
module.exports = env;
