var cookie = require('cookie');

var CookieParse = function(engine) {
    if(!(this instanceof CookieParse)) {
        return new CookieParse(engine);
    }

    this.engine = engine;

    this._use();

    return {};

};

CookieParse.prototype._use = function() {
    this.engine.app.use(function(req, res, next) {
        req.cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};

        next();
    });
};

module.exports = CookieParse;