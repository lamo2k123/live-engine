var fs  = require('fs'),
    path= require('path');

var Modules = function(manager) {
    if(!(this instanceof Modules)) {
        return new Modules(manager);
    }

    this.manager = manager;
    this.modules = {
        length : 0
    };

    return {
        get : this.get.bind(this),
        add : this.add.bind(this)
    }
};

Modules.prototype.add = function(name) {
    if(name && !this.modules[name]) {
        var dir     = path.join(__dirname, '..', 'modules', name),
            file    = path.join(dir, 'index.js'),
            status  = fs.existsSync(file);

        if(status) {
            this.modules[name] = require(file);
            this.modules.length++;
            return true;
        }

    }

    return false;
};

Modules.prototype.get = function(name) {
    if(name) {
        if(this.modules[name]) {
            return this.modules[name];
        } else {
            if(this.add(name)) {
                return this.get(name);
            }
        }
    }

    return false;
};



module.exports = Modules;