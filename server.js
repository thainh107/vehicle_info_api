// BASE SETUP
// =============================================================================

// call the packages we need

var events = require('events');
events.EventEmitter.defaultMaxListeners = 100;
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var morgan = require('morgan');
//var cors = require('cors');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
//app.use(cors());
// db config
var env = "dev";
var config = require('./database.json')[env];
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
sequelize
    .authenticate()
    .then(function(err) {
        console.log('Connection has been established successfully.');
    })
    .catch(function(err) {
        console.log('Unable to connect to the database:', err);
    });

var User = sequelize.import('./app/model/user')
var Vehicle = sequelize.import('./app/model/vehicle')
var Make = sequelize.import('./app/model/makecode')
var Made = sequelize.import('./app/model/madecode')
var VBody = sequelize.import('./app/model/vehiclebody')
var Garage = sequelize.import('./app/model/garagelocation')
var Models = sequelize.import('./app/model/models')
    // configure app to use bodyParser()
    // this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// on routes that end in /users
// ----------------------------------------------------
router.route('/users')

// create a user (accessed at POST http://localhost:8080/api/users)
.post(function(req, res) {

    var username = req.body.username; //bodyParser does the magic
    var fullname = req.body.fullname;

    var user = User.build({ username: username, fullname: fullname });

    user.add(function(success) {
            res.json({ message: 'User created!' });
        },
        function(err) {
            res.send(err);
        });
})

// get all the users (accessed at GET http://localhost:8080/api/users)
.get(function(req, res) {
    // find multiple entries
    User.findAll({
        attributes: ['username', 'fullname']
    }).then(function(users) {

        if (users) {
            res.json(users);
        } else {
            res.send(401, "User not found");
        }
    }, function(error) {
        console.log(error);
        res.send("User not found");
    });
});

// on routes that end in /users/:user_id
// ----------------------------------------------------
router.route('/users/:user_id')

// get the user with that id (accessed at GET http://localhost:8080/api/users/:user_id)
.get(function(req, res) {
    var user = User.build();

    user.retrieveById(req.params.user_id, function(users) {
        if (users) {
            res.json(users);
        } else {
            res.send(401, "User not found");
        }
    }, function(error) {
        res.send("User not found");
    });
})

// update the user with this id (accessed at PUT http://localhost:8080/api/users/:user_id)
.put(function(req, res) {
    var user = User.build();

    user.username = req.body.username;
    user.password = req.body.password;

    user.updateById(req.params.user_id, function(success) {
        console.log(success);
        if (success) {
            res.json({ message: 'User updated!' });
        } else {
            res.send(401, "User not found");
        }
    }, function(error) {
        res.send("User not found");
    });
})

// delete the user with this id (accessed at DELETE http://localhost:8080/api/users/:user_id)
.delete(function(req, res) {
    var user = User.build();

    user.removeById(req.params.user_id, function(users) {
        if (users) {
            res.json({ message: 'User removed!' });
        } else {
            res.send(401, "User not found");
        }
    }, function(error) {
        res.send("User not found");
    });
});
//------------------------ Categories load -------------------------
//make code
router.route('/categories/makesCode')
    //Example : http://localhost:8080/api/categories/makesCode
    .get(function(req, res) {
        // find multiple entries
        Make.findAll({
                where: {
                    isdeleted: 0
                },
                attributes: ['code', 'name']
            })
            .then(function(makes) {
                if (makes) {
                    res.json(makes);
                } else {
                    res.send(401, "makesCode not found");
                }
            }, function(error) {
                console.log(error);
                res.send("makesCode not found");
            });
    });
//vehicle made
router.route('/categories/madesCode')
    //Example : http://localhost:8080/api/categories/madesCode
    .get(function(req, res) {
        // find multiple entries
        Made.findAll({
                where: {
                    isdeleted: 0,
                    isactive: 1
                },
                attributes: ['code', 'indicator']
            })
            .then(function(makes) {
                if (makes) {
                    res.json(makes);
                } else {
                    res.send(401, "madesCode not found");
                }
            }, function(error) {
                console.log(error);
                res.send("madesCode not found");
            });
    });
//vehicle body
router.route('/categories/vehiclebody')
    //Example : http://localhost:8080/api/categories/vehiclebody
    .get(function(req, res) {
        // find multiple entries
        VBody.findAll({
                where: {
                    isdeleted: 0
                },
                attributes: ['bodytypeid', 'name']
            })
            .then(function(vbody) {
                if (vbody) {
                    res.json(vbody);
                } else {
                    res.send(401, "vehiclebody not found");
                }
            }, function(error) {
                console.log(error);
                res.send("vehiclebody not found");
            });
    });
//Garage location
router.route('/categories/garagelocation')
    //Example : http://localhost:8080/api/categories/garagelocation
    .get(function(req, res) {
        // find multiple entries
        Garage.findAll({
                where: {
                    isdeleted: 0,
                    isactive: 1
                },
                attributes: ['code', 'name']
            })
            .then(function(garage) {
                if (garage) {
                    res.json(garage);
                } else {
                    res.send(401, "Garage location not found");
                }
            }, function(error) {
                console.log(error);
                res.send("Garage location not found");
            });
    });
//Vehicle Year
router.route('/categories/vehicleyear')
    //Example : http://localhost:8080/api/categories/vehicleyear
    .get(function(req, res) {
        // find multiple entries
        Models.findAll({
                distinct: 'ismyear',
                where: {
                    isdeleted: 0,
                    isactive: 1
                },
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('ismyear')), 'code'],
                    ['ismyear', 'name']
                ]
            })
            .then(function(models) {
                if (models) {
                    res.json(models);
                } else {
                    res.send(401, "Year not found");
                }
            }, function(error) {
                console.log(error);
                res.send("Year not found");
            });
    });
//Vehicle Models
var ModelGroups = sequelize.import('./app/model/modelgroups')
router.route('/categories/vehiclemodel/:makeCode')
    //Example : http://localhost:8080/api/categories/vehiclemodel/NI
    .get(function(req, res) {
        // find multiple entries
        ModelGroups.findAll({
                where: {
                    isdeleted: 0,
                    isactive: 1,
                    makecode: req.params.makeCode
                },
                attributes: ['modelgroupid', 'ismfamily']
            })
            .then(function(modelgroups) {
                if (modelgroups) {
                    res.json(modelgroups);
                } else {
                    res.send(401, "modelgroups not found");
                }
            }, function(error) {
                console.log(error);
                res.send("modelgroups not found");
            });
    });

//Vehicle Use
var VehicleUses = sequelize.import('./app/model/usageVehicleUse')
router.route('/categories/vehicleUse')
    //Example : http://localhost:8080/api/categories/vehicleUse
    .get(function(req, res) {
        // find multiple entries
        VehicleUses.findAll({
                where: {
                    isdeleted: 0
                },
                attributes: [
                    'code', 'name'
                ]
            })
            .then(function(vehicleuses) {
                if (vehicleuses) {
                    res.json(vehicleuses);
                } else {
                    res.send(401, "Vehicle use not found");
                }
            }, function(error) {
                console.log(error);
                res.send("Vehicle use not found");
            });
    });
//Regions Category
var Regions = sequelize.import('./app/model/regions')
router.route('/categories/regions')
    //Example : http://localhost:8080/api/categories/regions
    .get(function(req, res) {
        // find multiple entries
        Regions.findAll({
                where: {
                    isdeleted: 0
                },
                attributes: [
                    'code', 'name'
                ]
            })
            .then(function(regions) {
                if (regions) {
                    res.json(regions);
                } else {
                    res.send(401, "regions not found");
                }
            }, function(error) {
                console.log(error);
                res.send("regions not found");
            });
    });
//Safety Features
var SafetyFeatures = sequelize.import('./app/model/safetyfeatures')
router.route('/categories/safetyfeatures')
    //Example : http://localhost:8080/api/categories/safetyfeatures
    .get(function(req, res) {
        // find multiple entries
        SafetyFeatures.findAll({
                where: {
                    isdeleted: 0,
                    isactive: 1
                },
                attributes: [
                    'code', 'description'
                ]
            })
            .then(function(safetyfeatures) {
                if (safetyfeatures) {
                    res.json(safetyfeatures);
                } else {
                    res.send(401, "safetyfeatures not found");
                }
            }, function(error) {
                console.log(error);
                res.send("safetyfeatures not found");
            });
    });
//Anti Theft
var AntiTheft = sequelize.import('./app/model/antitheft')
router.route('/categories/antitheft')
    //Example : http://localhost:8080/api/categories/antitheft
    .get(function(req, res) {
        // find multiple entries
        AntiTheft.findAll({
                where: {
                    isdeleted: 0,
                    isactive: 1
                },
                attributes: [
                    'code', 'description'
                ]
            })
            .then(function(antithefts) {
                if (antithefts) {
                    res.json(antithefts);
                } else {
                    res.send(401, "antithefts not found");
                }
            }, function(error) {
                console.log(error);
                res.send("antithefts not found");
            });
    });
//Anti Theft
var Insurers = sequelize.import('./app/model/insurers')
router.route('/categories/insurers')
    //Example : http://localhost:8080/api/categories/insurers
    .get(function(req, res) {
        // find multiple entries
        Insurers.findAll({
                where: {
                    isdeleted: 0
                },
                attributes: [
                    'code', 'name'
                ]
            })
            .then(function(insurers) {
                if (insurers) {
                    res.json(insurers);
                } else {
                    res.send(401, "Insurers not found");
                }
            }, function(error) {
                console.log(error);
                res.send("Insurers not found");
            });
    });
// ----------------------------------------------------
router.route('/vehicles/:vehiclesID')
    // get all the vehicles (accessed at GET http://localhost:8080/api/vehicles/:vehiclesID)
    //Example : http://localhost:8080/api/vehicles/43F4BDC1-8F35-4054-BC6C-5B98CB0DB099
    .get(function(req, res) {
        // find multiple entries
        Vehicle.findAll({
                where: {
                    vehicleid: req.params.vehiclesID
                },
                attributes: ['registrationno', 'logbookno', 'chassisno', 'engineno', 'seatcapacity', 'makecode', 'model', 'yearmake', 'createddatetime', 'createdby']
            })
            .then(function(vehicles) {
                if (vehicles) {
                    res.json(vehicles);
                } else {
                    res.send(401, "Vehicles not found");
                }
            }, function(error) {
                console.log(error);
                res.send("Vehicles not found");
            });
    });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);