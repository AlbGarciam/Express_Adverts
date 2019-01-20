"use strict";

require('dotenv').config();
require('./dbConnection.js');
const fs = require('fs');
const AdvertController = require("../controller/advertController");
const UserController = require("../controller/userController");
let users = fs.readFileSync('./database/default_users.json', {encoding:'utf8'});
let adverts = fs.readFileSync('./database/default_adverts.json', {encoding:'utf8'});

async function load_users(data) {
    try {
        var obj = JSON.parse(data);
        for (let i= 0; i < obj.users.length; i++){
            var user = obj.users[i];
            try {
                await UserController.create_user(user.name, user.password, user.username);
                console.log("[fill_database][load_users] user loaded: " + JSON.stringify(user));
            } catch (err){
                console.log("[fill_database][load_users] user can't be loaded: " + JSON.stringify(user));
            }
        }
    } catch(err){
        console.log(err);
    }
};

async function load_adverts(data) {
    try {
        var obj = JSON.parse(data);
        for (let i= 0; i < obj.adverts.length; i++){
            var advert = obj.adverts[i];
            try {
                await AdvertController.insertAdvert(advert.nombre, advert.venta, advert.precio, advert.foto, advert.tags)
                console.log("[fill_database][load_adverts] advert loaded: " + JSON.stringify(advert));
            } catch (err){
                console.log("[fill_database][load_adverts] advert can't be loaded: " + JSON.stringify(advert));
            }
        }
    } catch(err){
        console.log(err);
    }
};


console.log("[fill_database] Starting filling database");
var fill = (async () => {
    await load_users(users);
    await load_adverts(adverts);
    process.exit(0);
});
fill();