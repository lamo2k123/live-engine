require.config({
	baseUrl: 'js',
	paths: {
        text        : 'lib/requirejs/text',
        domReady    : 'lib/requirejs/domReady',

		jquery		: 'lib/jquery/jquery-2.1.1.min',
		underscore	: 'lib/lodash/lodash.underscore.min',
		io 			: 'lib/socket.io/socket.io-1.0.6',
		backbone	: 'lib/backbonejs/backbone-min'
	},
	deps : [
		'app/components/user/main',
		'app/components/header/main',
//		'app/components/overlay/main'
	],
	callback : function(User, Header, Overlay) {
		new Header();
//		new Overlay();
		new User();

	}
});