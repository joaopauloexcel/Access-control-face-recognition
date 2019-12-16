module.exports = (sequelize, Sequelize) => {//simulação real da tabela users do mysql
	const People = sequelize.define('peoples', {//passando o nome da tabela
	  name: {
		  type: Sequelize.STRING(50)//Definindo tipo do atributo da tabela
	  },
	  email: {
		type: Sequelize.STRING(50)//Definindo tipo do atributo da tabela
	  },
	  street: {
		  type: Sequelize.STRING(80)//Definindo tipo do atributo da tabela
	  },
	  nStreet: {
		type: Sequelize.STRING(10)//Definindo tipo do atributo da tabela
	  },
	  hood: {
		type: Sequelize.STRING(80)//Definindo tipo do atributo da tabela
	  },
	  complement: {
		type: Sequelize.STRING(50)//Definindo tipo do atributo da tabela
	  },
	  city: {
		type: Sequelize.STRING(50)//Definindo tipo do atributo da tabela
	  },
	  state: {
		type: Sequelize.STRING(2)//Definindo tipo do atributo da tabela
	  },
	  zipCode: {
		type: Sequelize.STRING(15)//Definindo tipo do atributo da tabela
	  },
	  passwordHome: {
		type: Sequelize.STRING(100)//Definindo tipo do atributo da tabela
	  },
	  passwordApp: {
	    type: Sequelize.STRING(100)//Definindo tipo do atributo da tabela
	  },
	  situation: {
		type: Sequelize.STRING(1)//0 Bloqueado - 1 Ativo
		},
	  faces: {
		type: Sequelize.STRING(1)//0 Bloqueado - 1 Ativo
  	  } 
	});
	
	return People;//retorna para a função o usuário criado/mapeado
}