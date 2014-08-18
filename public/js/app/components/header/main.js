define([
	'backbone'
], function(
	Backbone
) {

	var Main = Backbone.View.extend({
		el : $('#header'),
		events: {
			'click #sign-up-button' : 'eventSignUp',
			'click #sign-in-button' : 'eventSignIn'
		},

		initialize: function() {

            Backbone.Events.on('header:sign-up', this.beSignUp.bind(this));
            Backbone.Events.on('header:sign-in', this.beSignIn.bind(this));

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
		}

	});

	return Main;
});