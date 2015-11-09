var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    MongoClient = require('mongodb').MongoClient,
    Elo = require('arpad'),
    redis = require("redis"),
    config = require('config'),
    settings = config.get('settings'),
    elo = new Elo(settings.elo.duel),
    StatsManager;

StatsManager = function(serverManager) {
    EventEmitter.call(this);
    var self = this;
    this.serverManager = serverManager;
};

util.inherits(StatsManager, EventEmitter);

StatsManager.prototype.start = function (cb) {
    var self = this;
    this.serverManager.start(function () {
        MongoClient.connect(settings.mongodb.connectionString, function (err, mongo) {
            var events = mongo.collection('events'),
                players = mongo.collection('players'),
                matches = mongo.collection('matches'),
                reports = mongo.collection('reports'),
                player_stats = mongo.collection('player_stats'),
                client = redis.createClient();

            self.serverManager.on(function (data) {
                console.log(data.TYPE, data.SERVER.name);
                self.emit(data.TYPE, data);
                self.emit("*", data);
            });

            self.on("*", function (events) {
                return function (eventData) {
                    events.insert(eventData);
                };
            });
            self.on('MATCH_STARTED', require('./handlers/onMatchStarted')(matches, client));
            self.on('PLAYER_STATS', require('./handlers/onPlayerStats')(players, client));

            self.on('MATCH_REPORT', require('./handlers/onMatchReport')(players, player_stats, reports, client, elo));
            self.on('PLAYER_CONNECT', require('./handlers/onPlayerConnect')(players, client));

            self.on('PLAYER_DISCONNECT', require('./handlers/onPlayerDisconnect')(players, client));
            cb();
        });
    });

};


exports.create = function () {
  return new StatsManager();
};