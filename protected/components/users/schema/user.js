var crypto = require('crypto');

module.exports = function(mongoose) {

    var User = new mongoose.Schema({
		login	: {
			type	: String,
			min 	: 3,
			max 	: 40,
			unique	: true
		},
		email   : {
			type	: String,
			min 	: 3,
			max 	: 256,
			unique	: true,
			required: true
		},
		password: {
			type 	: String,
			required: true
		},
		date    : {
			reg : {
				type    : Date,
				default : Date.now
			},
			last : Date
		},
		banned 	: Boolean,

		group   : Number,
        avatar 	: String

    });

	User.pre('save', function(next) {
		this.password = crypto.createHash('sha1').update(this.password).digest('hex');
		console.log(this);
		next && next()
	});

	mongoose.model('user', User);
};