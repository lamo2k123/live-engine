define([
    'io',
    './up',
    './in'
], function(
    io,
    Up,
    In
) {

	var Main = function() {
        var channel = io.connect('http://localhost:3000/users', {
            transports : ['websocket']
        });

        new Up({
            el : $('#sign-up'),
            io : channel
        });

        new In({
            el : $('#sign-in'),
            io : channel
        });

    };

	return Main;
});