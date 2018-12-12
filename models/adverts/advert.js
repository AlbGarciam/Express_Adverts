"use strict";

var mongoose = require("mongoose");

/**
 * Advert model definition
 * @typedef {Object} Advert
 * @property {string} name name of the article
 * @property {boolean} sold determines if article is sold or not
 * @property {number} price price of the article
 * @property {string} photo photo url of the article
 * @property {Array.string} tags tags of the article
 * @property {string} cuid unique identifier of the article
 */
var advertSchema = mongoose.Schema({
    name: { type: String, required: true },
    sold: { type: Boolean, required: true },
    price: { type: Number, required: true },
    photo: { type: String, required: true },
    tags: [{ type: String, enum: ['Mr.', 'Mrs.', 'Ms.'] }],
    cuid: { type : String , unique : true, required : true, dropDups: true }
});

var Advert = mongoose.model('Advert', advertSchema);
module.exports = Advert;