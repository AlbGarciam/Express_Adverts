"use strict";

require('./database/dbConnection.js');
var fs = require('fs');
const advertController = require("./controller/advertController");
const userController = require("./controller/userController");

function load_users() {
    fs.readFile('./database/default_users.json', 'utf8', function (err, data) {
        if (err) {
            console.error("Cannot read file")
        } else {
            var obj = JSON.parse(data);
            obj.users.forEach(element => {
                userController.create_user(element.name, element.password, element.username).then((result) => {
                    console.log("[fill_database][load_users] user loaded: " + JSON.stringify(element));
                }, (err) => {
                    console.log("[fill_database][load_users] user can't be loaded: " + JSON.stringify(element));
                });
            });
        }
        
      });
};

function load_ads() {
    fs.readFile('./database/default_adverts.json', 'utf8', function (err, data) {
        if (err) {
            console.error("Cannot read file")
        } else {
            var obj = JSON.parse(data);
            obj.adverts.forEach(element => {
                advertController.insert_advert(element.nombre, element.venta, element.precio, element.foto, element.tags).then((result) => {
                    console.log("[fill_database][load_ads] Ad loaded: " 
                                            + JSON.stringify(element));
                }, (err) => {
                    console.log("[fill_database][load_ads] Ad can't be loaded: " 
                                            + JSON.stringify(element));
                });
            });
        }
        
      });
};


console.log("[fill_database] Starting filling database");
load_users();
load_ads();