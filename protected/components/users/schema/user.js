var crypto  = require('crypto'),
    mongoose= require('mongoose');

var User = new mongoose.Schema({
    login	: {
        type	: String,
        min 	: 3,
        max 	: 40
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
    banned 	: {
        type 	: Boolean,
        default : false
    },
    avatar 	: String,

    group   : Number

});

User.pre('save', function(next) {
    this.password = crypto.createHash('sha1').update(this.password).digest('hex');
    next && next()
});

mongoose.model('user', User);

module.exports = User;