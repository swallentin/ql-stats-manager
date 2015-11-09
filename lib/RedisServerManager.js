var RedisServerManager,
    redis = require('redis'),
    Server = require('ql-server-monitor').Server;

RedisServerManager = function(monitor) {
    this.serverMonitor = monitor;
    this.client = {};
    this.subscriber = {};
};

function makeServerRedisKey (server){
    [server[name].hostname, server.gameport].join(':')
}

RedisServerManager.prototype.start = function (cb) {
    this.client = redis.createClient();
    this.subscriber = redis.createClient();

    this.serverMonitor.on('SERVER_REMOVED', function (server) {
        var redisKey = makeServerRedisKey(server);
        self.client.srem('active_servers', redisKey);
        self.client.hdel('server:'+ serverId);
    });

    this.serverMonitor.on('SERVER_ADDED', function () {
       // add s
    });

    this.subscriber.on('message', function (topic, serverInformation) {

        if(topic === 'ql-stats-engine:server:add') {
            self.serverMonitor.add(Server.create(JSON.parse(serverInformation)));
        }

        if(topic === 'ql-stats-engine:server:remove') {
            console.log('ql-stats-engine:server:remove', serverInformation);
            self.serverMonitor.remove(JSON.parse(serverInformation));
        }
    });

    this.subscriber.subscribe('ql-stats-engine:server:add');
    this.subscriber.subscribe('ql-stats-engine:server:remove');

    this.client.smembers('active_servers', function (err, serverKeys) {

        if (err) {
            return cb(err);
        }

        serverKeys.forEach(function (serverKey) {
            try {
                self.client.hgetall(serverKey, function (err, serverSettings) {
                    if(err) {
                        console.log(err);
                        return cb(err);
                    }

                    self.serverMonitor.add(Server.create(serverSettings));
                });

            }
            catch(e) {
                console.error(e);
                return cb(err);
            }
            cb();
        });

    });
} ;


exports.create = function (monitor) {
    return new RedisServerManager(monitor);
};
