define([
    'io',
    './models/user',
    './views/sign-up',
    './views/sign-in',
    './views/user-bar'
], function(
    io,
    ModelUser,
    ViewSignUp,
    ViewSignIn,
    ViewUserBar
) {

	var Main = function() {
        this.io = io.connect('http://localhost:3000/', {
            transports : ['websocket']
        });

        this.models = {
            user : new ModelUser()
        };

        this.views = {
            signUp : new ViewSignUp({
                el      : $('#sign-up'),
                model   : this.models.user,
                io      : this.io
            }),
            signIn : new ViewSignIn({
                el      : $('#sign-in'),
                model   : this.models.user,
                io      : this.io
            }),
            userBar: new ViewUserBar({
                el      : $('#user-bar'),
                model   : this.models.user
            })
        };


        this.io.on('sign-in', this.socketSignIn.bind(this));

    };

    Main.prototype.socketSignIn = function(bStatus, oData) {
        if(bStatus && oData) {
            oData.auth = true;
            this.models.user.set(oData);

            Backbone.Events.trigger('user:sign-in', true);
        } else {

        }

        return this;
    };

	return Main;
});