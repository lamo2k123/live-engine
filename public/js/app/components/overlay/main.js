define([
	'backbone'
], function(
	Backbone
) {

	var Main = Backbone.View.extend({
		el : $('body'),

		initialize: function() {

			Backbone.Events.on('component:overlay', this.toggle.bind(this));

		},

		toggle : function(bStatus) {
			if(bStatus) {
				this.$el.addClass('overlay');
			} else {
				this.$el.removeClass('overlay');
			}

			return this;
		}

	});

	return Main;
});