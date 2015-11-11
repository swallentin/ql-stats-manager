var Redis = require('redis'),
    Server = require('ql-server-monitor').Server,
    RedisServerManager;

RedisServerManager = function(monitor, log) {
    this.monitor = monitor;
    this.store = {};
    this.subscriber = {};
    this.log = log || console;
};

RedisServerManager.prototype.start = function (cb) {
    var self = this;

    this.store = Redis.createClient();
    this.subscriber = Redis.createClient();

    this.subscriber.on('message', function (topic, server) {
        if(topic === 'ql-redis-server-manager:server:add') {
            self.log.info('ql-redis-server-manager:server:add', self.monitor.add(Server.createServer(JSON.parse(server))));
        }
    });

    this.subscriber.on('message', function (topic, id) {
        if(topic === 'ql-redis-server-manager:server:remove') {
            self.log.info('ql-redis-server-manager:server:remove', id);
            self.monitor.remove(id);
        }
    });

    this.store.smembers('active_servers', function (err, serverKeys) {

        if (err) {
            return cb(err);
        }

        serverKeys.forEach(function (serverKey) {
            try {
                self.store.hgetall(serverKey, function (err, serverSettings) {
                    if(err) {
                        return cb(err);
                    }

                    console.log(serverKey);

                    self.monitor.add(Server.createServer(serverSettings));
                });

            }
            catch(e) {
                self.log.error(e);
                return cb(err);
            }
        });

        cb();
    });
} ;


exports.createManager = function (monitor, log) {
    return new RedisServerManager(monitor, log);
};
