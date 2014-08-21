var crypto = require('crypto'),
    cookie = require('cookie');

var Session = function(engine) {
    if(!(this instanceof Session)) {
        return new Session(engine);
    }

    this.engine = engine;
    this.unique = 0;

    this._use();

    return {};

};

Session.prototype._use = function() {
    var name    = this.engine.manager.configs.get('cookie').name,
        options = this.engine.manager.configs.get('cookie').options,
        generate= this._generate;

    this.engine.app.use(function(req, res, next) {
        if(!req.cookies[name]) {
            res.setHeader('Set-Cookie', cookie.serialize(name, generate(), options));
        }

        next();
    });
};

Session.prototype._generate = function() {
    var hash = [new Date().getTime(), this.unique++].join('|');

    return crypto.createHash('sha1').update(hash).digest('hex');
};

module.exports = Session;