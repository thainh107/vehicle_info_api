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
    var Vehicle = sequelize.define('vehicles', {
            registrationno: Sequelize.STRING,
            makecode: Sequelize.STRING,
            model: Sequelize.STRING,
            yearmake: Sequelize.STRING,
            chassisno: Sequelize.STRING,
            engineno: Sequelize.STRING,
            createddatetime: Sequelize.DATEONLY,
            createdby: Sequelize.STRING
        }

    );
    return Vehicle;
}