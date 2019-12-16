module.exports = (sequelize, Sequelize) => {//simulação real da tabela users do mysql
    const Access = sequelize.define('access', {//passando o nome da tabela
	  peopleId: {
            type: Sequelize.INTEGER,
            references: {         // User hasMany WorkingDays n:n
              model: 'peoples',
              key: 'id'
            }
		  },
	  dateTime: {
		  type: Sequelize.STRING(25)
      },
    status: {
        type: Sequelize.STRING(1)//0 negado - 1 liberado
    }
  },{
    timestamps: false
  });
	
	return Access;//retorna para a função o usuário criado/mapeado
}