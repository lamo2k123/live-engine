//var LocalStrategy  = require('passport-local').Strategy;
var crypto = require('crypto');

module.exports = function(app) {
    var Sessions = app.get('components-manager').getApi('Sessions');

	require('./schema/user.js')(app.get('require').mongoose);

	var Users = function() {
		this.User = app.get('require').mongoose.model('user');

		app.get('require').io
			.of('/users')
			.on('connection', function(socket) {
                console.log(app.get('require')['cookie'].parse(socket.handshake.headers.cookie));
				socket.on('sign-up', this.signUp.bind(this, socket));
				socket.on('sign-in', this.signIn.bind(this, socket));
//			socket.emit('news', { news: 'item' });
			}.bind(this));
/*
        app.get('require')['passport'].use(new LocalStrategy(
            function(username, password, done) {
                this.User.findOne({ username: username }, function (err, user) {
                    if (err) { return done(err); }
                    if (!user) { return done(null, false); }
                    if (!user.verifyPassword(password)) { return done(null, false); }
                    return done(null, user);
                });
            }.bind(this)
        ));*/


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
                    Sessions.add(socket.id, {
                        email : user.email
                    });
                    socket.emit('sign-in', true, Sessions.get(socket.id));
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
