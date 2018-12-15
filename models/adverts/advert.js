"use strict";

var mongoose = require("mongoose");

/**
 * Advert model definition
 * @typedef {Object} Advert
 * @property {string} name name of the article
 * @property {boolean} sold determines if article is sold or not
 * @property {number} price price of the article
 * @property {string} photo photo url of the article
 * @property {Array.String} tags tags of the article
 * @property {string} cuid unique identifier of the article
 */
var advertSchema = mongoose.Schema({
    name: { type: String, required: true },
    sold: { type: Boolean, required: true },
    price: { type: Number, required: true },
    photo: { type: String, required: true },
    tags: [{ type: String, enum: ["work", "lifestyle", "motor", "mobile"] }],
    cuid: { type : String , unique : true, required : true, dropDups: true }
});

advertSchema.statics.list = (filter, limit, skip, sort, callback) => {
    var query = Advert.find(filter);
    query.limit(limit);
    query.skip(skip);
    query.select("name sold price photo tags cuid -_id");
    query.sort(sort);
    query.exec(callback); 
};

var Advert = mongoose.model('Advert', advertSchema);
module.exports = Advert;