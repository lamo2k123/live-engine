var crypto = require('crypto'),
	cookie = require('cookie');

var Sessions = {
	unique 	: 0,
	store 	: {
		length : 0
	},

	use : function(req, res, next) {
		if(!req.cookies['live-engine.sid']) {
			res.set('Set-Cookie', cookie.serialize('live-engine.sid', this.generate(), req.app.get('configs').cookie));
		}

		next();
	},

	generate : function() {
		var hash = [new Date().getTime(), this.unique++].join('|');

		return crypto.createHash('sha1').update(hash).digest('hex');
	},

	add : function(sid, data) {
		if(sid && data && !this.store[sid]) {
			this.store[sid] = data;
			this.store.length++;
			return true;
		} else {
			return false;
		}
	},

	remove : function(sid) {
		if(sid && this.store[sid]) {
			delete this.store[sid];
			this.store.length--;
			return true;
		} else {
			return false;
		}
	},

	has : function(sid) {
		return (sid && this.store[sid]);
	},

	get : function(sid) {
		return sid && this.store[sid];
	}

};

module.exports.use = Sessions.use.bind(Sessions);
module.exports.add = Sessions.add.bind(Sessions);
module.exports.has = Sessions.has.bind(Sessions);
module.exports.get = Sessions.get.bind(Sessions);
module.exports.remove = Sessions.remove.bind(Sessions);