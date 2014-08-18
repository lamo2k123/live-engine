define([
    'lang',
	'backbone',
	'io'
], function(
    Lang,
	Backbone,
	io
) {

	var Main = Backbone.View.extend({
		el : $('#sign'),
		io : null,

		events: {
			"click #sign-buttons-submit"    : "eventSubmit",
            'click #sign-buttons-reset'     : 'eventButtonReset',
            'click #sign-password-toggle'   : 'eventPasswordToggle',
            'keyup #sign-email-input'       : 'eventSignEmailInput',
            'keyup #sign-password-input'    : 'eventSignPasswordInput'
		},

		initialize: function() {
			this.io = io.connect('http://localhost:3000/users', {
			 	transports : ['websocket']
			});

			this.io.on('connect', function () {
			 console.log(arguments);
			 //			chat.emit('hi!');
			 });


		},

        eventSubmit : function(e) {
            e && e.preventDefault();

            if(this.email && this.password) {
                this.io.emit('sign-up', {
                    login 	: login,
                    email 	: email,
                    password: password
                });
            }

            return this;
        },

        eventButtonReset : function() {
            var $button     = this.$el.find('#sign-password-toggle'),
                $type       = this.$el.find('#sign-password-input'),
                $email      = this.$el.find('#sign-email'),
                $password   = this.$el.find('#sign-password');

            if($button) {
                $button
                    .removeClass('icon-eye-off')
                    .addClass('icon-eye');
            }

            if($type) {
                $type.attr('type', 'password');
            }

            if($email) {
                $email.attr('data-message', '');
            }

            if($email) {
                $email
                    .removeClass('success')
                    .removeClass('error')
                    .attr('data-message', '');
            }

            if($password) {
                $password
                    .removeClass('success')
                    .removeClass('error')
                    .attr('data-message', '');
            }

            this.password = this.email = false;

            this.signButtonSubmitStatus();

            return this;
        },

        eventPasswordToggle : function(e) {
            e && e.preventDefault();

            var $type = this.$el.find('#sign-password-input');

            if(e.currentTarget) {
                $(e.currentTarget)
                    .toggleClass('icon-eye')
                    .toggleClass('icon-eye-off');
            }

            if($type) {
                if($type.attr('type') === 'password') {
                    $type.attr('type', 'text');
                } else {
                    $type.attr('type', 'password');
                }
            }

            return this;
        },

        eventSignEmailInput : function(e) {
            var value   = $(e.currentTarget).val(),
                $email  = this.$el.find('#sign-email'),
                validate= /^[\wа-яА-ЯёЁ\.\-\_]+@[\wа-яА-ЯёЁ\.\-\_]+\.[\wа-яА-ЯёЁ\.\-\_]+$/gm;

            if(value.length && validate.test(value)) {
                if($email) {
                    $email
                        .removeClass('error')
                        .addClass('success')
                        .attr('data-message', 'Адрес доступен!');
                }

                this.email = true;
            } else {
                if($email) {
                    $email.removeClass('success').addClass('error');
                }

                if(!value.length) {
                    $email && $email.attr('data-message', 'Введите ваш e-mail.');
                } else if(!validate.test(value)) {
                    $email && $email.attr('data-message', 'Это не похоже на e-mail.');
                } else {
                    $email && $email.attr('data-message', 'Такой адрес уже существует.');
                }

                this.email = false;
            }

            this.signButtonSubmitStatus();

            return this;
        },

        eventSignPasswordInput : function(e) {
            var value       = $(e.currentTarget).val(),
                $password   = this.$el.find('#sign-password');

            if(value.length) {
                $password
                    .removeClass('error')
                    .addClass('success')
                    .attr('data-message', Lang[['SIGN_PASSWORD_STRENGTH_LEVEL', this._checkPasswordStrength(value)].join('_')]);

                this.password = true;
            } else {
                $password
                    .removeClass('success')
                    .addClass('error')
                    .attr('data-message', Lang['SIGN_PASSWORD_ENTER']);

                this.password = false;
            }

            this.signButtonSubmitStatus();

            return this;
        },

        signButtonSubmitStatus : function() {
            var $button = this.$el.find('#sign-buttons-submit');

            if($button) {
                if(this.password && this.email) {
                    $button.removeClass('disable');
                } else {
                    $button.addClass('disable');
                }
            }

            return this;
        },

        _checkPasswordStrength : function(password){
            var c   = 0,
                lvl = 0;

            if(password.length < 5) {
                c = (c + 7);
            }
            else if(password.length > 4 && password.length < 8) {
                c = (c + 14);
            }
            else if(password.length > 7 && password.length < 16){
                c = (c + 17);
            }
            else if(password.length > 15) {
                c = (c + 23);
            }

            if(password.match(/[a-z]/)) {
                c = (c + 9)
            }

            if(password.match(/[A-Z]/)) {
                c = (c + 10);
            }

            if(password.match(/\d+/)) {
                c = (c + 10);
            }

            if(password.match(/(.*[0-9].*[0-9].*[0-9])/)) {
                c = (c + 10);
            }

            if(password.match(/.[!,@,#,$,%,^,&,*,?,_,~]/)) {
                c = (c + 10);
            }

            if(password.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/)) {
                c = (c + 10);
            }

            if(password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
                c = (c + 7);
            }

            if(password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) {
                c = (c + 7);
            }

            if(password.match(/([a-zA-Z0-9].*[!,@,#,$,%,^,&,*,?,_,~])|([!,@,#,$,%,^,&,*,?,_,~].*[a-zA-Z0-9])/)) {
                c = (c + 15);
            }

            if(c < 21) {
                lvl = 0;
            } else {
                if(c > 20 && c < 30) {
                    lvl = 1;
                } else {
                    if(c > 29 && c < 43) {
                        lvl = 2;
                    } else {
                        if(c > 42 && c < 60) {
                            lvl = 3;
                        } else {
                            lvl = 4;
                        }
                    }
                }
            }

            return lvl;
        }

	});

	return Main;
});