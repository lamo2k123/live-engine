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

		events: {
			"click #sign-in-buttons-submit"    : "eventSubmit",
            'click #sign-in-buttons-reset'     : 'eventButtonReset',
            'click #sign-in-password-toggle'   : 'eventPasswordToggle',
            'keyup #sign-in-email-input'       : 'eventSignEmailInput',
            'keyup #sign-in-password-input'    : 'eventSignPasswordInput'
		},

		initialize: function(options) {
            this.io = options.io;

            Backbone.Events.on('sign-in:toggle', this.beSignToggle.bind(this));

            this.io.on('sign-in', this.ioSignIn.bind(this));


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

        ioSignIn : function(bStatus, oData) {
            if(bStatus && oData) {

            }

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

            if(!this.query && this.email && this.password) {
                var $email      = this.$el.find('#sign-in-email-input'),
                    $password   = this.$el.find('#sign-in-password-input');

                $email.prop('readonly', true);
                $password.prop('readonly', true);

                if($email.val() && $password.val()) {
                    this.query = true;

                    this.io.emit('sign-in', $email.val(), $password.val());
                }

            }

            return this;
        },

        eventButtonReset : function() {
            var $button     = this.$el.find('#sign-in-password-toggle'),
                $type       = this.$el.find('#sign-in-password-input'),
                $email      = this.$el.find('#sign-in-email'),
                $password   = this.$el.find('#sign-in-password');

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
                .trigger('sign-in:toggle', false)
                .trigger('user:user-bar:sign-in', false);

            return this;
        },

        eventPasswordToggle : function(e) {
            e && e.preventDefault();

            var $type = this.$el.find('#sign-in-password-input');

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
                $email  = this.$el.find('#sign-in-email'),
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
                }

                this.email = false;
            }

            this.signButtonSubmitStatus();

            return this;
        },

        eventSignPasswordInput : function(e) {
            var value       = $(e.currentTarget).val(),
                $password   = this.$el.find('#sign-in-password');

            if(value.length) {

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

        signButtonSubmitStatus : function() {
            var $button = this.$el.find('#sign-in-buttons-submit');

            if($button) {
                if(this.password && this.email) {
                    $button.removeClass('disable');
                } else {
                    $button.addClass('disable');
                }
            }

            return this;
        }

	});

	return Main;
});