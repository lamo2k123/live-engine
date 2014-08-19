define([
	'backbone'
], function(
	Backbone
) {

	var Main = Backbone.View.extend({
		io      : null,
        query   : false,
        email   : false,
        password: false,
        rules   : false,

		events: {
			"click #sign-up-buttons-submit"    : "eventSubmit",
            'click #sign-up-buttons-reset'     : 'eventButtonReset',
            'click #sign-up-password-toggle'   : 'eventPasswordToggle',
            'keyup #sign-up-email-input'       : 'eventSignEmailInput',
            'keyup #sign-up-password-input'    : 'eventSignPasswordInput',
            'change #sign-up-rules-input'      : 'eventSignRulesInput'
		},

		initialize: function(options) {
            this.io = options.io;

            Backbone.Events.on('sign-up:toggle', this.beSignToggle.bind(this));

            this.io.on('sign-up', this.ioSignUp.bind(this));

            this.model.on('change:auth', this.observeAuth.bind(this));
		},

        observeAuth : function() {
            if(this.model.get('auth')) {
                this.remove();
            } else {
                this.render();
            }

            return this;
        },

        ioSignUp : function() {

            // @TODO: ???
            this.query = false;
        },

        beSignToggle : function(bStatus) {

            if(bStatus === undefined) {
                this.$el.toggleClass('show');
            } else {
                if(bStatus) {
                    this.$el.addClass('show');
                } else {
                    this.$el.removeClass('show');
                }
            }

            return this;
        },

        eventSubmit : function(e) {
            e && e.preventDefault();

            if(!this.query && this.rules && this.email && this.password) {
                var $email      = this.$el.find('#sign-up-email-input'),
                    $password   = this.$el.find('#sign-up-password-input'),
                    $rules      = this.$el.find('#sign-up-rules-input');

                $email.prop('readonly', true);
                $password.prop('readonly', true);
                $rules.prop('disabled', true);

                if($email.val() && $password.val()) {
                    this.query = true;

                    this.io.emit('sign-up', {
                        email 	: $email.val(),
                        password: $password.val()
                    });
                }

            }

            return this;
        },

        eventButtonReset : function() {
            var $button     = this.$el.find('#sign-up-password-toggle'),
                $type       = this.$el.find('#sign-up-password-input'),
                $email      = this.$el.find('#sign-up-email'),
                $password   = this.$el.find('#sign-up-password');

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

            Backbone.Events
                .trigger('sign-up:toggle', false)
                .trigger('user:user-bar:sign-up', false);

            return this;
        },

        eventPasswordToggle : function(e) {
            e && e.preventDefault();

            var $type = this.$el.find('#sign-up-password-input');

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
                $email  = this.$el.find('#sign-up-email'),
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
                $password   = this.$el.find('#sign-up-password');

            if(value.length) {
                $password
                    .removeClass('error')
                    .addClass('success')
                    .attr('data-message', 'SIGN_PASSWORD_STRENGTH_LEVEL' + this._checkPasswordStrength(value));

                this.password = true;
            } else {
                $password
                    .removeClass('success')
                    .addClass('error')
                    .attr('data-message', 'SIGN_PASSWORD_ENTER');

                this.password = false;
            }

            this.signButtonSubmitStatus();

            return this;
        },

        eventSignRulesInput : function(e) {
            var $rules = $(e.currentTarget);

            this.rules = $rules[0].checked;

            this.signButtonSubmitStatus();

            return this;
        },

        signButtonSubmitStatus : function() {
            var $button = this.$el.find('#sign-up-buttons-submit');

            if($button) {
                if(this.rules && this.password && this.email) {
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