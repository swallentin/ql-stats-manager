var async = require('async'),
    serverMonitor = require('ql-server-monitor').create(),
    redisServerManager = require('./lib/RedisServerManager').create(serverMonitor),
    statsManager = require('./lib/StatsManager').create(serverMonitor);

async.series([
    statsManager.start,
    redisServerManager.start
], function (err, results) {
    if(err) {
        console.log(err);
        return process.exit(1);
    }
   console.log('Started ql-stats-manager successfully.');
});