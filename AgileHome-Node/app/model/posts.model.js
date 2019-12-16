module.exports = (sequelize, Sequelize) => {//simulação real da tabela users do mysql
    const Posts = sequelize.define('posts', {//passando o nome da tabela
	  peopleEmitId: {
            type: Sequelize.INTEGER,
            references: {         // User hasMany WorkingDays n:n
              model: 'peoples',
              key: 'id'
            }
		  },
    peopleRecepId: {
            type: Sequelize.INTEGER,
            references: {         // User hasMany WorkingDays n:n
              model: 'peoples',
              key: 'id'
            }
		  },
    title: {
	  	type: Sequelize.STRING(30)//Definindo tipo do atributo da tabela
      },
	  text: {
		  type: Sequelize.STRING(255)//Definindo tipo do atributo da tabela
	  },
	  status: {
		  type: Sequelize.STRING(1)//Definindo tipo do atributo da tabela
      }      
	});
	
	return Posts;//retorna para a função o usuário criado/mapeado
}