require('./schema/user.js');

var crypto  = require('crypto'),
    mongoose= require('mongoose');

module.exports = function(app, engine) {

	var Users = function() {
		this.User = mongoose.model('user');

        engine.io
			.channel('/users')
			.on('connection', function(socket) {
                socket.on('sign-up', this.signUp.bind(this, socket));
				socket.on('sign-in', this.signIn.bind(this, socket));
			}.bind(this));

		return {
			name: 'users',
			api	: {
                isAuth : engine.manager.sessions.has.bind(engine.manager.sessions)
			}
		};
	};

	Users.prototype.signUp = function(socket, oData) {
		if(socket && oData) {
			var user = new this.User(oData);

			user.save(this.signUp_callback.bind(this, socket));
		}

		return this;
	};

	Users.prototype.signIn = function(socket, email, password) {
		if(socket && email && password) {
            this.User.findOne({
                email   : email,
                password: crypto.createHash('sha1').update(password).digest('hex')
            }, function(error, user) {
                if(!error) {
					var sid = socket.cookies['live-engine.sid'];

                    if(!engine.manager.sessions.has(sid)) {
                        engine.manager.sessions.add(sid, {
                            socket 	: socket.id,
                            email 	: user.email,
                            date	: user.date,
                            banned	: user.banned,
                            avatar	: user.avatar || 'http://www.gravatar.com/avatar/' + crypto.createHash('md5').update(user.email.trim().toLowerCase()).digest('hex') + '?r=pg'
                        });
                        socket.emit('sign-in', true, engine.manager.sessions.get(sid));
                    }

                } else {
                    socket.emit('sign-in', false);
                }
            });
		}

		return this;
	};

	Users.prototype.signUp_callback = function(socket, error, user) {
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

	return new Users();
};
