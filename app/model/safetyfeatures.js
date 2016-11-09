// db config
var env = "dev";
var config = require('../../database.json')[env];
var password = config.password ? config.password : null;

var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.database, config.user, password, {
    host: config.host,
    dialect: config.driver,

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

});

module.exports = function(sequelize, DataTypes) {
    var SafeFeatures = sequelize.define('safetyfeatures', {
        code: Sequelize.STRING,
        description: Sequelize.STRING
    }, {
        tableName: 'safetyfeatures'
    });
    return SafeFeatures;
}