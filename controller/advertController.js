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
            console.error("[AdvertController][insert_advert] Not passed validation");
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

/**
 * Returns the adverts from the database acording filters
 * 
 * @param {string} id id of the article
 * @param {Array.string} tags tags of the article
 * @param {boolean} sold determines if article is sold or not
 * @param {string} name name of the article
 * @param {number} price price of the article
 * @param {string} sort field which will be used to sort the response
 * @param {number} limit number of items which will be returned
 * @param {number} skip number of items that will be skipped
 * @returns {Promise} Promise
 */
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
                reject( CustomError.BAD_REQUEST );
            }
            resolve(list);
        });
    });
};

module.exports.get_tags = () => {
    return new Promise( (resolve, reject) => {
        Advert.distinct('tags', (err, tags) => {
            if (err) {
                reject( CustomError.BAD_REQUEST );
            }
            resolve(tags);
        });
    });
};

/**
 * Creates an advert model
 * @param {string} name name of the article
 * @param {boolean} sold is sold
 * @param {number} price price of item
 * @param {url} photo url to image
 * @param {Array.string} tags tags of item 
 */
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

/**
 * 
 * @param {Object} filter filter which is going to be used
 * @param {number} price exact price
 * @param {number} lower lower limit
 * @param {number} upper upper limit
 */
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
};