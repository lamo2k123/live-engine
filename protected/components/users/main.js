var LocalStrategy  = require('passport-local').Strategy;

module.exports = function(app) {

	require('./schema/user.js')(app.get('require').mongoose);

	var Users = function() {
		this.User = app.get('require').mongoose.model('user');

		app.get('require').io
			.of('/users')
			.on('connection', function(socket) {
				socket.on('sign-up', this.signUp.bind(this, socket));
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
