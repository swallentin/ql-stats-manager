var MongoClient = require('mongodb').MongoClient,
    Redis = require("redis"),
    config = require('config'),
    settings = config.get('settings'),
    StatsManager;

StatsManager = function(monitor, log) {
    this.monitor = monitor;
    this.log = log || console;
};

StatsManager.prototype.start = function (cb) {
    var monitor = this.monitor,
        self = this;

    MongoClient.connect(settings.mongodb.connectionString, function (err, mongo) {
        if(err) {
            self.log.error(err);
            cb(err);
        }

        var redis = Redis.createClient(),
            onEvent = require('./handlers/onEvent')(mongo, redis, self.log),
            onMatchStarted = require('./handlers/onMatchStarted')(mongo, redis, self.log),
            onPlayerStats = require('./handlers/onPlayerStats')(mongo, redis, self.log),
            onMatchReport = require('./handlers/onMatchReport')(mongo, redis, self.log),
            onPlayerConnect = require('./handlers/onPlayerConnect')(mongo, redis, self.log),
            onPlayerDisconnect = require('./handlers/onPlayerDisconnect')(mongo, redis, self.log);

        [
            'PLAYER_CONNECT',
            'PLAYER_DISCONNECT',
            'PLAYER_SWITCHTEAM',
            'PLAYER_MEDAL',
            'PLAYER_DEATH',
            'MATCH_STARTED',
            'ROUND_OVER',
            'PLAYER_STATS',
            'MATCH_REPORT'
        ].forEach(function (event) {
            monitor.on(event, onEvent);
        });

        monitor.on('MATCH_STARTED',onMatchStarted );
        monitor.on('PLAYER_STATS', onPlayerStats);
        monitor.on('MATCH_REPORT', onMatchReport);
        monitor.on('PLAYER_CONNECT', onPlayerConnect);
        monitor.on('PLAYER_DISCONNECT', onPlayerDisconnect);

        cb();
    });
};

exports.createManager = function (monitor, log) {
  return new StatsManager(monitor, log);
};