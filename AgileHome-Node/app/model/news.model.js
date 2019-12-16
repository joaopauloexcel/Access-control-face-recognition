module.exports = (sequelize, Sequelize) => {//simulação real da tabela users do mysql
    const News = sequelize.define('news', {//passando o nome da tabela
	  peopleId: {
            type: Sequelize.INTEGER,
            references: {         // User hasMany WorkingDays n:n
              model: 'peoples',
              key: 'id'
            }
	  },
	  dateTime: {
		  type: Sequelize.STRING(20)
      },
      text: {
        type: Sequelize.STRING(150)
     }
  },{
    timestamps: false
  });
	
	return News;
}