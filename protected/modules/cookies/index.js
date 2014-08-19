var cookie = require('cookie');

module.exports.use = function(req, res, next) {
	req.cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};

	next();
};