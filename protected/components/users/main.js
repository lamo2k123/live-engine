require('./schema/user.js');

var crypto  = require('crypto'),
    mongoose= require('mongoose');


var User = function(engine) {
    if(!(this instanceof User)) {
        return new User(engine);
    }

    this.engine = engine;
    this.model = mongoose.model('user');

    this.engine.io.on('connection', function(socket) {
        socket.on('sign-up', this.registration.bind(this, socket));
        socket.on('sign-in', this.authorization.bind(this, socket));
    }.bind(this))

    return {
        isAuthorization : this.isAuthorization.bind(this)
    };

};

User.prototype.registration = function(socket, oData) {
    if(socket && oData) {
        var user = new this.model(oData);

        user.save(this._registration_cb.bind(this, socket));
    }

    return this;
};

User.prototype._registration_cb = function(socket, error, user) {
    if(!error && socket && user) {
        socket.emit('sign-up', {
            status 	: true,
            email 	: user.email
        });
    } else {
        socket.emit('sign-up', {
            status : false
        });
    }

    return this;
};

User.prototype.authorization = function(socket, email, password) {
    if(socket && email && password) {
        console.log(this.model);
        this.model.findOne({
            email : email,
            password : crypto.createHash('sha1').update(password).digest('hex')
        }, this._authorization_cb.bind(this, socket));
    }

    return this;
};

User.prototype._authorization_cb = function(socket, error, user) {
    if(!error) {
        var sid = socket.cookies[this.engine.manager.configs.get('cookie').name];

        if(!this.engine.manager.sessions.has(sid)) {
            this.engine.manager.sessions.add(sid, {
                socket 	: socket.id,
                email 	: user.email,
                date	: user.date,
                banned	: user.banned,
                avatar	: user.avatar || 'http://www.gravatar.com/avatar/' + crypto.createHash('md5').update(user.email.trim().toLowerCase()).digest('hex') + '?r=pg'
            });
            socket.emit('sign-in', true, this.engine.manager.sessions.get(sid));
        }

    } else {
        socket.emit('sign-in', false);
    }
};

User.prototype.isAuthorization = function(sid) {
    return this.engine.manager.sessions.has(sid);
};

module.exports = User;