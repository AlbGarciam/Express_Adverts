"use strict";

var mongoose = require("mongoose");

/**
 * Advert model definition
 * @typedef {Object} Advert
 * @property {string} name
 * @property {boolean} sold
 * @property {number} price
 * @property {Array.string} tags
 * @property {String} cuid
 */
var advertSchema = mongoose.Schema({
    name: { type: String, required: true },
    sold: { type: Boolean, required: true },
    price: { type: Number, required: true },
    photo: { type: String, required: true },
    tags: [{ type: String, enum: ['Mr.', 'Mrs.', 'Ms.'] }],
    cuid: { type : String , unique : true, required : true, dropDups: true }
});