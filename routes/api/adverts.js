const express = require('express');
const router = express.Router();
const AdvertController = require('../../controller/advertController');
const { check, validationResult } = require('express-validator/check');

/* POST Creates a new advert
 * curl -d '{      
            "nombre": "Bicicleta",      
            "venta": true,      
            "precio": 230.15,      
            "foto": "http://localhost:8080/images/anuncios/bici.jpg",      
            "tags": [ "lifestyle", "motor"]    
        }' -H "Content-Type: application/json" -X POST http://localhost:8080/api/user/login
*/
router.post('/create', [
    check('name').isEmpty().withMessage("Name must not be empty"),
    check('price').isNumeric().withMessage("Price must be numeric"),
    check('sold').isBoolean().withMessage("Sold must be boolean"),
    check('photo').isURL().withMessage("Photo must be an url"),
    check('tags').isArray().withMessage("Tags must be an array")
], (req, res, next) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(VALIDATION_FAILED(errors.array()[0].msg ))
    }
    var promise = AdvertController.insert_advert(req.body.username, String(req.body.password));
    promise.then((result) => {
        res.status(200).send('ok');
    }, (err) => {
        next(err);
    });
});

router.get('/', (req, res, next) => {
    var limit = parseInt(req.query.limit) || null;
    var skip = parseInt(req.query.skip) || null;
    var sort = req.query.sort || null;
    var id = req.query.id || null;
    var tags = req.query.tags || null;
    var sold = req.query.venta || null;
    var name = req.query.nombre || null;
    var price = req.query.precio || null;

    var promise = AdvertController.get_adverts(id, tags, sold, name, price,  sort, limit, skip);
    promise.then((result) => {
        res.status(200).json({
            adverts: result
        });
    }, (err) => {
        next(err);
    });
});

module.exports = router;
