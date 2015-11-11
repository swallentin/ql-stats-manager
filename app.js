var async = require('async'),
    winston = require('winston'),
    monitor = require('ql-server-monitor').createMonitor(winston),
    redisServerManager = require('./lib/RedisServerManager').createManager(monitor, winston);
    statsManager = require('./lib/StatsManager').createManager(monitor, winston);

monitor.setMaxListeners(0);

statsManager.start(function (err) {
    if(err) {
        console.error(err);
        process.exit(1);
    }
    redisServerManager.start(function (err) {
        if(err) {
            winston.error(err);
            process.exit(1);
        }
        winston.log('Started ql-stats-manager successfully.');

    });
});
