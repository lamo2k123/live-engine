define([
	'backbone',
    'text!../templates/user-bar.html'
], function(
	Backbone,
    TemplateUserBar
) {

	var Main = Backbone.View.extend({

		events: {
            'click #sign-up-button' : 'eventSignUp',
            'click #sign-in-button' : 'eventSignIn',
            'click #sign-out-button': 'eventSignOut'
		},

		initialize: function() {

            Backbone.Events.on('user:user-bar:sign-up', this.beSignUp.bind(this));
            Backbone.Events.on('user:user-bar:sign-in', this.beSignIn.bind(this));


            this.model.on('change:auth', this.render.bind(this));

		},

        eventSignIn : function(e) {
            e && e.preventDefault();

            Backbone.Events
                .trigger('sign-in:toggle')
                .trigger('sign-up:toggle', false);

            this.$el.find('#sign-in-button').toggleClass('selected');
            this.$el.find('#sign-up-button').removeClass('selected');

            return this;
        },

        eventSignUp : function(e) {
            e && e.preventDefault();

            Backbone.Events
                .trigger('sign-up:toggle')
                .trigger('sign-in:toggle', false);

            this.$el.find('#sign-up-button').toggleClass('selected');
            this.$el.find('#sign-in-button').removeClass('selected');

            return this;
        },

        eventSignOut : function(e) {
            e && e.preventDefault();

            this.model.clear();

            return this;
        },

        beSignUp : function(bStatus) {
            if(bStatus) {
                this.$el
                    .find('#sign-up-button')
                    .addClass('selected');
            } else {
                this.$el
                    .find('#sign-up-button')
                    .removeClass('selected');
            }

            return this;
        },

        beSignIn : function(bStatus) {
            if(bStatus) {
                this.$el
                    .find('#sign-in-button')
                    .addClass('selected');
            } else {
                this.$el
                    .find('#sign-in-button')
                    .removeClass('selected');
            }

            return this;
        },

        render : function() {

            var template = _.template(TemplateUserBar, {
                avatar  : this.model.get('avatar'),
                auth    : this.model.get('auth'),
                email   : this.model.get('email')
            });

            this.$el.html(template);

            return this;
        }

	});

	return Main;
});