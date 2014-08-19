var Sessions = require('../../modules/sessions/index.js');

module.exports = function(app) {

	require('./schema/user.js')(app.get('require').mongoose);

	var Users = function() {
		this.User = app.get('require').mongoose.model('user');

		app.get('require').io
			.of('/users')
			.on('connection', function(socket) {
                socket.on('sign-up', this.signUp.bind(this, socket));
				socket.on('sign-in', this.signIn.bind(this, socket));
			}.bind(this));

		return {
			name: 'users',
			api	: {

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
					var sid = app.get('require')['cookie-parser'].signedCookie(socket.handshake.headers.cookie);

					Sessions.add(sid, {
						socket 	: socket.id,
                        email 	: user.email,
						date	: user.date,
						banned	: user.banned,
						avatar	: user.avatar || 'http://www.gravatar.com/avatar/' + crypto.createHash('md5').update(user.email).digest('hex')
                    });
                    socket.emit('sign-in', true, Sessions.get(sid));
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
