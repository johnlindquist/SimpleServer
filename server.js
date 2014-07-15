var Sequelize = require('sequelize-sqlite').sequelize;
var sqlite = require('sequelize-sqlite').sqlite;

var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();
app.use(cors());
app.use(bodyParser.json());


var sequelize = new Sequelize('database', 'username', '', {
    dialect: 'sqlite',
    storage: 'database.db'
})

var People = sequelize.define('people', {
        firstName: Sequelize.STRING,
        lastName: Sequelize.STRING,
        phone: Sequelize.STRING,
        email: Sequelize.STRING,
        address: Sequelize.STRING,
        city: Sequelize.STRING,
        zip: Sequelize.STRING,
        country: Sequelize.STRING
    },
    {
        timestamps: false
    })

function connected() {
    app.route("/people")
        .get(function (req, res) {
            People.findAll().success(function (users) {
                res.send(users);
            })
        })
        .post(function (req, res) {
            People.create(req.body).success(function (person) {
                res.json(person);
            })
        })


    app.route("/people/:id")
        .get(function (req, res) {
            var id = req.params.id;
            console.log(id);
            People.find({where: {id: id}}).success(function (person) {
                res.json(person);
            })
        })
        .put(function (req, res) {
            var id = req.params.id;
            People.find({where: {id: id}}).success(function (person) {
                person.updateAttributes(req.body).success(function () {
                    res.json(person);
                })
            })
        })
        .delete(function (req, res) {
            var id = req.params.id;
            People.find({where: {id: id}}).success(function (person) {
                person.destroy().success(function () {
                    var message = "Deleted person " + id;
                    res.send(message);
                })
            })
        });


    app.listen(3000, function () {
        console.log("listening on port 3000");
    })
};


sequelize.sync().success(connected)

