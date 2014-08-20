var fs  = require('fs'),
    path= require('path');

var Configs = function(manager) {
    if(!(this instanceof Configs)) {
        return new Configs(manager);
    }

    this.manager = manager;
    this.configs = {
        length : 0
    };

    return {
        get : this.get.bind(this),
        add : this.add.bind(this)
    }
};

Configs.prototype.add = function(name) {
    if(name && !this.configs[name]) {
        var dir     = path.join(__dirname, '..', '..', 'configs'),
            file    = path.join(dir, name + '.json'),
            status  = fs.existsSync(file);

        if(status) {
            this.configs[name] = require(file);
            this.configs.length++;
            return true;
        }

    }

    return false;
};

Configs.prototype.get = function(name) {
    if(name) {
        if(this.configs[name]) {
            return this.configs[name];
        } else {
            if(this.add(name)) {
                return this.get(name);
            }
        }
    }

    return false;
};



module.exports = Configs;