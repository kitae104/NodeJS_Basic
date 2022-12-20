const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};

let sequelize;
sequelize = new Sequelize(config.database, config.username, config.password, config);


db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.newCustomer = require('./customer')(sequelize, Sequelize);
db.newPurchase = require('./purchase')(sequelize, Sequelize);

db.newCustomer.hasMany(db.newPurchase, { foreignKey: 'customer_id', sourceKey: 'id' });
db.newPurchase.belongsTo(db.newCustomer, { foreignKey: 'customer_id', sourceKey: 'id' });

module.exports = db;
