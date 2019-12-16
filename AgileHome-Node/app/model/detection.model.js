module.exports = (sequelize, Sequelize) => {//simulação real da tabela users do mysql
    const Detection = sequelize.define('detection', {//passando o nome da tabela
	  peopleId: {
            type: Sequelize.INTEGER,
            references: {         // User hasMany WorkingDays n:n
              model: 'peoples',
              key: 'id'
            }
		  },
    status: {
        type: Sequelize.STRING(1)//0 negado - 1 liberado
    }
  },{
    timestamps: false//inibe a criação de campos de alteração.
  });
	
	return Detection;//retorna para a função o usuário criado/mapeado
}