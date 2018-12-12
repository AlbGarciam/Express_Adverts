"use strict";

const Cuid = require('cuid');
const sanitizeHTML = require('sanitize-html');
const Advert = require('../models/adverts/advert');
const CustomError = require('../models/customErrors');

/**
 * Inserts an advert in the database
 * @param {string} name name of the article
 * @param {boolean} sold determines if article is sold or not
 * @param {number} price price of the article
 * @param {string} photo photo url of the article
 * @param {Array.string} tags tags of the article
 * @returns {Promise} Promise
 */
module.exports.insert_advert = (name, sold, price, photo, tags) => {
    return new Promise( (resolve, reject) => {
        var _advert = create_advert(name, sold, price, photo, tags);
        var error = _advert.validateSync();
        if (error) {
            reject(CustomError.WRONG_PARAMS);
        } else {
            _advert.save( (err, saved) => {
                if (err)
                    reject( CustomError.WRONG_PARAMS );
                resolve(saved);
            });
        }
    } );
};

function create_advert(name, sold, price, photo, tags) {
    var _advert = new Advert();
    _advert.name = sanitizeHTML(name);
    _advert.sold = sold;
    _advert.price = price;
    _advert.photo = photo;
    _advert.tags = tags;
    _advert.cuid = Cuid();
    return _advert;
};