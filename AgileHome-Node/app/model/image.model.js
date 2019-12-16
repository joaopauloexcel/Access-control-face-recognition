module.exports = (sequelize, Sequelize) => {//simulação real da tabela users do mysql
const Image = sequelize.define('image', {
    peopleId: {
            type: Sequelize.INTEGER,
            references: {         // User hasMany WorkingDays n:n
              model: 'peoples',
              key: 'id'
            }
	  },
    data: {
        type: Sequelize.BLOB('long')
    }
  });
  return Image
}