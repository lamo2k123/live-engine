
var Routes = function(engine) {
	if(!(this instanceof Routes)) {
		return new Routes(engine);
	}

	this.engine = engine;

	return {
		get : this.get.bind(this),
		post: this.post.bind(this)
	};

};

Routes.prototype.get = function(route, fn) {
	this.engine.app.use(route, this._use.bind(this, 'GET', fn));
};

Routes.prototype.post = function(route, fn) {
	this.engine.app.use(route, this._use.bind(this, 'POST', fn));
};

Routes.prototype._use = function(type, fn, req, res, next) {
	(req.method === type) ? fn(req, res, next) : next();
};

module.exports = Routes;