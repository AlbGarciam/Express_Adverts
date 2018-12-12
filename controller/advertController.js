"use strict";

const Cuid = require('cuid');
const sanitizeHTML = require('sanitize-html');
const Advert = require('../models/adverts/advert');
const CustomError = require('../models/customErrors');
const { Price } = require('../models/adverts/price');

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
            console.debug("[AdvertController][insert_advert] Not passed validation");
            reject(CustomError.WRONG_PARAMS);
        } else {
            _advert.save( (err, saved) => {
                if (err) {
                    console.log(err);
                    reject( CustomError.WRONG_PARAMS );
                }
                resolve(saved);
            });
        }
    } );
};

module.exports.get_adverts = (id, tags, sold, name, price, sort, limit, skip) => {
    var filter = {};
    if ( id )
        filter.cuid = id;
    if (sold !== null) 
        filter.sold = sold;
    if ( name ) 
        filter.name = new RegExp("^"+ name.toLowerCase(), "i");
    if ( price !== null){
        var obj = Price(price);
        insert_price_filter(filter, obj.exact, obj.lower, obj.upper);
    }
    if ( tags !== null ) 
        filter.tags = tags;
    return new Promise( (resolve, reject) => {
        Advert.list(filter, limit, skip, sort, (err, list) => {
            if (err) {
                console.log(err);
                reject( CustomError.BAD_REQUEST );
            }
            resolve(list);
        });
    });
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

function insert_price_filter(filter, price, lower, upper) {
    if ( typeof price !== 'undefined' ) {
        filter.price = price
    } else if ( typeof lower !== 'undefined' || typeof upper !== 'undefined' ) {
        var priceFilter = {};
        if ( typeof lower !== 'undefined' ) {
            price.$gte = lower;
        } 
        if ( typeof upper !== 'undefined' )  {
            price.$lte = upper;
        }
        filter.price = priceFilter
    }
}