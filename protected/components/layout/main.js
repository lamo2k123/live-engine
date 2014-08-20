module.exports = function(app, engine) {
    app
        .route('/')
        .get(function(req, res) {
            console.log(engine.manager.components.api('users'));
//			console.log(req);
            res.render('layout', { users: 123 });
        });

    return {
        name : 'layout',
        api : {

        }
    };
};
