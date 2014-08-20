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
