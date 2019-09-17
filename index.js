var async = require('async');
var chalk = require('chalk');

module.exports = class Logger {

    constructor(config) {
        config = config||{ console: true }
        this.console = config.console;
        this.password = config.password;
        this.httppassword = config.httppassword;
        this.padSize = config.padSize;
    }

    log(level, key, message, obj, callback) {
        async.auto({
            http: ac => {
                if (!this.httppassword) return ac();
                if (level == 'info') return ac();

                request({
                    url: 'https://' + config.httppassword + '@monitoring.raphaelpiccolo.com/fr/logger',
                    method: 'POST',
                    json: {
                        message: data,
                        err: err
                    },
                }, (err) => {
                    ac();
                });
            },
            console: ac => {
                if (!this.console)
                    return ac();

                var s = key.padStart(this.padSize);
                if (level == 'warn') s = chalk.yellow(s);
                if (level == 'error') s = chalk.red(s);
                if (level == 'info') s = chalk.blue(s);
                console.log((new Date()).toJSON() + ' ' +  s + ' ' + message);
                ac();
            }
        }, function () {
            if (callback)
                return callback();
        });
    }

    info(key, message, obj, callback) {
        this.log('info', key, message, obj, callback);
    }

    error(key, message, obj, callback) {
        this.log('error', key, message, obj, callback);
    }

    warn(key, message, obj, callback) {
        this.log('warn', key, message, obj, callback);
    }

}

