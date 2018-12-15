"use strict";

const express = require('express');
const router = express.Router();
const AdvertController = require('../../controller/advertController');
const { body, validationResult } = require('express-validator/check')
const { VALIDATION_FAILED } = require('../../models/customErrors');

/**
 * curl --header "Authorization: 123" http://localhost:8080/api/adverts
 */
router.get('/', (req, res, next) => {
    var limit = parseInt(req.query.limit) || null;
    var skip = parseInt(req.query.skip) || null;
    var sort = req.query.sort || null;
    var id = req.query.id || null;
    var tags = req.query.tags || null;
    var sold = req.query.sold || null;
    var name = req.query.name || null;
    var price = req.query.price || null;

    var promise = AdvertController.get_adverts(id, tags, sold, name, price,  sort, limit, skip);
    promise.then((result) => {
        res.status(200).json({
            adverts: result
        });
    }, (err) => {
        next(err);
    });
});

/* POST Creates a new advert
 * curl -d '{      
            "nombre": "triciclo",      
            "venta": true,      
            "precio": 20,15,      
            "foto": "http://127.0.0.1:8080/images/anuncios/bici.jpg",      
            "tags": [ "lifestyle", "motor"]    
        }' -H "Content-Type: application/json" -X POST http://localhost:8080/api/adverts/create
*/
router.post('/create', [
    body('nombre').not().isEmpty().withMessage("nombre must not be empty"),
    body('precio').isNumeric().withMessage("precio must be numeric"),
    body('venta').isBoolean().withMessage("sold must be boolean"),
    body('foto').isURL().withMessage("foto must be an url"),
    body('tags').isArray().withMessage("tags must be an array")
], (req, res, next) => {
    console.info(req.body);
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(VALIDATION_FAILED( errors.array()[0].msg ))
    }
    var promise = AdvertController.insert_advert(req.body.nombre, 
                                                 req.body.venta, 
                                                 req.body.precio, 
                                                 req.body.foto, 
                                                 req.body.tags);
    promise.then((result) => {
        res.status(200).send('ok');
    }, (err) => {
        next(err);
    });
});

router.get('/tags', (req, res, next) => {
    var promise = AdvertController.get_tags();
    promise.then((result) => {
        res.status(200).json({
            tags: result
        });
    }, (err) => {
        next(err);
    });
});

module.exports = router;
