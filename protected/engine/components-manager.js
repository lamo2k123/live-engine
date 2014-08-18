var fs  = require('fs'),
    path= require('path');

module.exports = function(app){

    var ComponentsManager = function() {
        this.dir = path.join(app.get('dirname'), app.get('config').dir.protected, app.get('config').dir.components);
        this.components = {};

        this.loaded();
    };

    ComponentsManager.prototype.loaded = function(){
        fs.readdir(this.dir, this._readdir.bind(this));

        return this;
    };

    ComponentsManager.prototype._readdir = function(error, files) {
        if(!error) {
            for(var i in files) {
                var dir = path.join(this.dir, files[i]);
                fs.stat(dir, this._stat.bind(this, dir));
            }
        } else {
            console.log('_readdir', error);
        }

        return this;
    };

    ComponentsManager.prototype._stat = function(dir, error, stat) {
        if(!error) {
            if(stat.isDirectory()) {
                var main = path.join(dir, app.get('config').component.main);
                fs.exists(main, this._exists.bind(this, main));
            }
        } else {
            console.log('_stat', error);
        }

        return this;
    };

    ComponentsManager.prototype._exists = function(main, exists) {
        if(exists) {
            var component = require(main)(app);
            this.components[component.name] = component.api;
        }

        return this;
    };

    ComponentsManager.prototype.getApi = function(component) {
        if(component && this.components[component]) {
            return this.components[component];
        }

        return false;
    };

    new ComponentsManager(app)
};
