module.exports = function(app) {

    app
        .route('/')
        .get(function(req, res) {
            res.render('layout', { users: 123 });
        });

    return {
        name : 'layout',
        api : {

        }
    };
};
