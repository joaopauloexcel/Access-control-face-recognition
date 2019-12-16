module.exports = (sequelize, Sequelize) => {
	const Role = sequelize.define('roles', {
	  id: {
        type: Sequelize.INTEGER,
        primaryKey: true
	  },
	  name: {
		  type: Sequelize.STRING(30)
	  }
	},{
		timestamps: false
	});
	
	return Role;
}