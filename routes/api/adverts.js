const express = require('express');
const router = express.Router();
const AdvertController = require('../../controller/advertController');
const { check, validationResult } = require('express-validator/check');

/* GET users listing.
 * curl -d '{"username":"correo@example.com", "password":"12345678"}' -H "Content-Type: application/json" -X POST http://localhost:8080/api/user/login
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

module.exports = router;
