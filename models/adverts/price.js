
function Price(precio) {
  const strPrice = String(precio); // 50-100
  const prices = strPrice.split('-'); // [50, 100]
  this.exact = null;
  this.lower = null;
  this.upper = null;
  if (strPrice.includes('-')) {
    if (strPrice.charAt(0) === '-') {
      [this.upper] = prices;
    } else if (strPrice.charAt(strPrice.length - 1) === '-') {
      [this.lower] = prices;
    } else {
      [this.lower, this.upper] = prices;
    }
  } else {
    [this.exact] = prices;
  }
}
module.exports.Price = Price;
