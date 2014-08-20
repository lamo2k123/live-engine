var cookie = require('cookie');

var CookieParse = function() {
};

CookieParse.prototype.use = function(req, res, next) {
    req.cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};

    next();
};

module.exports = new CookieParse();