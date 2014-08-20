var cookie = require('cookie');

module.exports.use = function(socket, next) {
    if(!socket.cookies) {
        socket.cookies = socket.handshake.headers.cookie ? cookie.parse(socket.handshake.headers.cookie) : {};
    }

    next();
};

