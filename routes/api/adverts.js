

const express = require('express');
const { body, check, validationResult } = require('express-validator/check');

const router = express.Router();
const AdvertController = require('../../controller/advertController');
const { VALIDATION_FAILED } = require('../../models/customErrors');
const jwtAuthMiddleware = require('../jwt');

// router.use( jwtAuthMiddleware() );

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');

    // authorized headers for preflight requests
    // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();

    router.options('*', (req, res) => {
        // allowed XHR methods  
        res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
        res.send();
    });
});
/**
 * This module is in charge of communicate with Advert database in mongodb
 * @module Routers/Adverts
 */


/**
 * Method that signs in the user
 * <p>curl --header "Authorization: 123" http://localhost:8080/api/adverts</p>
 * @name GetAdvert
 * @route {get} /api/adverts
 * @authentication This route uses JWT verification. If you don't have the JWT you need to
 * sign in with a valid user
 * @headerparam {String} Accept-Language Language of the response
 * @queryparam {Number} limit Maximun number of registers
 * @queryparam {Number} skip How many entries must be skipped on the request
 * @queryparam {String} sort Attribute which will be used to sort the entries
 * @queryparam {String} id Id of ad
 * @queryparam {String} tags List tag to be filtered. If you want to add more than one tag,
 * you should separate them by commas
 * @queryparam {Boolean} sold Filter if items are sold or not
 * @queryparam {String} name Filter by name
 * @queryparam {String | Number} price Price to be filtered
 */
router.get('/', [
  check('limit').optional().isNumeric().withMessage('LIMIT_NUMERIC'),
  check('skip').optional().isNumeric().withMessage('SKIP_NUMERIC'),
] , async (req, res, next) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(VALIDATION_FAILED(errors.array()[0].msg));
  }
  const limit = parseInt(req.query.limit, 10) || null;
  const skip = parseInt(req.query.skip, 10) || null;
  const sort = req.query.sort || null;
  const id = req.query.id || null;
  const tags = req.query.tags || null;
  const sold = req.query.sold || null;
  const name = req.query.name || null;
  const price = req.query.price || null;
  try{
    const result = await AdvertController.getAdverts(id, tags, sold, name, price, sort, limit, skip);
    res.status(200).json({
      adverts: result,
    });
  } catch(err) {
    next(err);
    return;
  }
});

/**
 * Creates a new advert
 * <p>curl -d '{
            "name": "triciclo",
            "sold": true,
            "price": 20.15,
            "photo": "http://127.0.0.1:8080/images/anuncios/bici.jpg",
            "tags": [ "lifestyle", "motor"]
        }' -H "Content-Type: application/json" -X POST http://localhost:8080/api/adverts/create</p>
 * @name CreateAdvert
 * @route {get} /api/adverts/create
 * @authentication This route uses JWT verification. If you don't have the JWT you need to sign in
 * with a valid user
 * @headerparam {String} Accept-Language Language of the response
 * @bodyparam {Array.String} tags List tag to be assigned to the item.
 * @bodyparam {Boolean} sold If item is sold or not
 * @bodyparam {String} name Name of the item
 * @bodyparam {Number} price Price of the item
 * @bodyparam {String} photo URL of the associated image
 */
router.post('/create', [
  body('name').not().isEmpty().withMessage('EMPTY_NAME'),
  body('price').isNumeric().withMessage('PRICE_NUMERIC'),
  body('sold').isBoolean().withMessage('SOLD_BOOL'),
  body('photo').isURL().withMessage('PHOTO_URL'),
  body('tags').isArray().withMessage('TAGS_ARRAY'),
], async (req, res, next) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(VALIDATION_FAILED(errors.array()[0].msg));
  }
  try {
    await AdvertController.insertAdvert(req.body.name,
      req.body.sold,
      req.body.price,
      req.body.photo,
      req.body.tags);
    res.status(200).send({message:'ok'})
  } catch (err) {
    next(err);
    return;
  }
});

/**
 * Retrieves the list of tags that are present in the database
 * <p>curl --header "Authorization: 123" http://localhost:8080/api/adverts/tags</p>
 * @name CreateAdvert
 * @route {get} /api/adverts/create
 * @authentication This route uses JWT verification. If you don't have the JWT you need to sign in
 * with a valid user
 * @headerparam {String} Accept-Language Language of the response
 */
router.get('/tags', async (req, res, next) => {
  try {
    const result = await AdvertController.get_tags();
    res.status(200).json({
      tags: result,
    });
  } catch (err) {
    next(err);
    return;
  }
});

module.exports = router;
