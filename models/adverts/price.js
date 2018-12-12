"use strict";

module.exports.Price = function(precio) {
    var _precio = String(precio); // 50-100
    var _precios = _precio.split("-"); //[50, 100]
    
    if (_precios.length === 2){
        this.exact = null;
        this.lower = _precios[0];
        this.upper = _precios[1];
    } else {
        this.exact = _precios[0];
        this.lower = null;
        this.upper = null;
    }
}