module.exports = function(app) {

    app
        .route('/news')
        .get(function(req, res) {
            res.render('layout', { users: 123 });
        });

    return {
        name : 'news',
        api : {

        }
    };
};
