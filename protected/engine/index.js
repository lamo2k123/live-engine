var connect = require('connect'),
	render	= require('connect-render');

console.log(render);

var Engine = function(app) {
	this.app = app;

	this.app.use(render({
		root: './public/templates/default',
		layout: 'layout.html',
		cache: true, // `false` for debug
		helpers: {
			sitename: 'connect-render demo site',
			starttime: new Date().getTime(),
			now: function (req, res) {
				return new Date();
			}
		}
	}));

	this.manager = {
		configs	: require('./manager/configs.js')(this),
		routes 	: require('./manager/routes.js')(this)
	};

	return {
		manager : this.manager,
		server : {
			start : this.start.bind(this)
		}
	};
};

Engine.prototype.start = function(port) {
	this.app.listen(port);
};

module.exports = new Engine(connect());

/*
var Manager = require('./manager');




//console.log(manager);

var cookie  = require('cookie'),
    io      = require('socket.io').listen(Manager.configs.get('socket').port);

io.channel = function(channel) {
    return this
        .of(channel)
        .use(function(socket, next) {
            if(!socket.cookies) {
                socket.cookies = socket.handshake.headers.cookie ? cookie.parse(socket.handshake.headers.cookie) : {};
            }

            next();
        });
};

module.exports.manager = Manager;
module.exports.io = io;
*/
