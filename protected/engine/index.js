var path    = require('path'),
    connect = require('connect'),
    io      = require('socket.io');

var Engine = function(app, io) {
    this.storage = {};

	this.app = app;
    this.io = io;

    this.set('#protected', path.join(__dirname, '..'));
    this.set('#public', path.join(this.get('#protected'), '..', 'public'));

	this.manager = {
		configs	: require('./manager/configs.js')(this),
		routes 	: require('./manager/routes.js')(this)
	};

    this.modules = {
        cookie  : require('./modules/cookie-parser.js')(this),
        session : require('./modules/session.js')(this),
        render  : require('./modules/render.js')(this)
    };

	return {
        get : this.get.bind(this),
        set : this.set.bind(this),

		manager : this.manager,
		server : {
			start : this.start.bind(this)
		}
	};
};

Engine.prototype.get = function(key) {
    if(key && this.storage[key]) {
        return this.storage[key];
    }
};

Engine.prototype.set = function(key, data) {
    if(key && data && !this.storage[key]) {
        this.storage[key] = data;
    }

    return this;
};

Engine.prototype.start = function() {
	this.app.listen(this.manager.configs.get('server').port);
    this.io.listen(this.manager.configs.get('socket').port)
};

module.exports = new Engine(connect(), io);

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
