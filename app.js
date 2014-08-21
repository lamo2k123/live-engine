var engine = require('./protected/engine');

engine.manager.routes.get('/test', function(req, res, next) {
	res.render('index', {
        isAuthorization : engine.component.user.isAuthorization(req.cookies[engine.manager.configs.get('cookie').name])
    });

});

engine.server.start();

/*
var path        = require('path'),
    mongoose    = require('mongoose'),
    bodyParser  = require('body-parser'),
    engine      = require('./protected/engine');

mongoose.connect('mongodb://' + engine.manager.configs.get('db').hosts.join(',') + '/' + engine.manager.configs.get('db').database, {
    user : engine.manager.configs.get('db').username,
    pass : engine.manager.configs.get('db').password
});

app.listen(8080);
console.log('Magic happens on port 8080');
*/
