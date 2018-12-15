

const Cuid = require('cuid');
const sanitizeHTML = require('sanitize-html');
const Advert = require('../models/adverts/advert');
const CustomError = require('../models/customErrors');
const { Price } = require('../models/adverts/price');

/**
 * This module is in charge of communicate with Advert database in mongodb
 * @module AdvertController
 */

/**
 *
 * Creates an advert model
 *
 * @param {string} name name of the article
 * @param {boolean} sold is sold
 * @param {number} price price of item
 * @param {url} photo url to image
 * @param {Array.String} tags tags of item
 */
function createAdvert(name, sold, price, photo, tags) {
  const advert = new Advert();
  advert.name = sanitizeHTML(name);
  advert.sold = sold;
  advert.price = price;
  advert.photo = photo;
  advert.tags = tags;
  advert.cuid = Cuid();
  return advert;
}

/**
 * Creates the filter of prices
 *
 * @param {Object} filter filter which is going to be used
 * @param {number} price exact price
 * @param {number} lower lower limit
 * @param {number} upper upper limit
 */
function insertPriceFilter(filter, price, lower, upper) {
  let newfilter = filter;
  if (typeof price !== 'undefined' && price !== null) {
    newfilter.price = price;
  } else if ((typeof lower !== 'undefined' && lower !== null)
        || (typeof upper !== 'undefined' && upper !== null)) {
    const priceFilter = {};
    if (typeof lower !== 'undefined' && lower !== null) {
      priceFilter.$gte = lower;
    }
    if (typeof upper !== 'undefined' && upper !== null) {
      priceFilter.$lte = upper;
    }
    newfilter.price = priceFilter;
  }
  return newfilter;
}

/**
 * Inserts an advert in the database
 *
 * @param {string} name name of the article
 * @param {boolean} sold determines if article is sold or not
 * @param {number} price price of the article
 * @param {string} photo photo url of the article
 * @param {Array.String} tags tags of the article
 * @returns {Promise} Promise
 */
module.exports.insertAdvert = (name, sold, price, photo, tags) => new Promise(
  (resolve, reject) => {
    const advert = createAdvert(name, sold, price, photo, tags);
    const error = advert.validateSync();
    if (error) {
      reject(CustomError.WRONG_PARAMS);
    } else {
      advert.save((err, saved) => {
        if (err) {
          reject(CustomError.WRONG_PARAMS);
        }
        resolve(saved);
      });
    }
  }
);

/**
 * Returns the adverts from the database acording filters
 *
 * @param {string} id id of the article
 * @param {Array.String} tags tags of the article
 * @param {boolean} sold determines if article is sold or not
 * @param {string} name name of the article
 * @param {number} price price of the article
 * @param {string} sort field which will be used to sort the response
 * @param {number} limit number of items which will be returned
 * @param {number} skip number of items that will be skipped
 * @returns {Promise} Promise
 */
module.exports.getAdverts = (id, tags, sold, name, price, sort, limit, skip) => {
  let filter = {};
  if (id) filter.cuid = id;
  if (sold !== null) filter.sold = sold;
  if (name) filter.name = new RegExp(`^${name.toLowerCase()}`, 'i');
  if (price !== null) {
    const obj = new Price(price);
    filter = insertPriceFilter(filter, obj.exact, obj.lower, obj.upper);
  }
  if (tags !== null) {
    const array = tags.split(',');
    filter.tags = { $in: array };
  }
  return new Promise((resolve, reject) => {
    Advert.list(filter, limit, skip, sort, (err, list) => {
      if (err) {
        reject(CustomError.BAD_REQUEST);
      }
      resolve(list);
    });
  });
};

module.exports.get_tags = () => new Promise((resolve, reject) => {
  Advert.distinct('tags', (err, tags) => {
    if (err) {
      reject(CustomError.BAD_REQUEST);
    }
    resolve(tags);
  });
});
