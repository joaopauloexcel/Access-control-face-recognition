const env = require('./env.js');//env recebe conexão com o banco de dados
 
const Sequelize = require('sequelize');//mapeia banco de dados do mysql
const sequelize = new Sequelize(env.database, env.username, env.password, {//instancia Sequelize
  host: env.host,//conecta no host e demais informações advindas do env
  dialect: env.dialect,
  operatorsAliases: false, 
  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
});
 
const db = {};//declaração do simulador do banco de dados
 
db.Sequelize = Sequelize;//injeta no objeto db a biblioteca sequelize
db.sequelize = sequelize;//injeta no objeto db a conexão do banco Mysql vinda do env.js

db.people = require('../model/people.model')(sequelize, Sequelize);
db.role = require('../model/role.model')(sequelize, Sequelize);
db.post = require('../model/posts.model')(sequelize, Sequelize);
db.access = require('../model/access.model')(sequelize, Sequelize);
db.news = require('../model/news.model')(sequelize, Sequelize);
db.detection = require('../model/detection.model')(sequelize, Sequelize);
db.recognition = require('../model/recognition.model')(sequelize, Sequelize);
db.image = require('../model/image.model')(sequelize, Sequelize);
 //tabela role conecta com a tabela user por meio da tabela user-roles
db.role.belongsToMany(db.people, { through: 'people_roles', foreignKey: 'roleId', otherKey: 'peopleId', timestamps: false});
db.people.belongsToMany(db.role, { through: 'people_roles', foreignKey: 'peopleId', otherKey: 'roleId', timestamps: false});

db.post.belongsTo(db.people, {foreignKey: 'peopleEmitId', otherKey: 'peopleRecepId'})
db.access.belongsTo(db.people, {foreignKey: 'peopleId'})
db.news.belongsTo(db.people, {foreignKey: 'peopleId'})
db.detection.belongsTo(db.people, {foreignKey: 'peopleId'})
db.recognition.belongsTo(db.people, {foreignKey: 'peopleId'})
db.image.belongsTo(db.people, {foreignKey: 'peopleId'})

module.exports = db;