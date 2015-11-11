function onPlayerConnect(mongo, redis) {
    var players = mongo.collection('players');
    return function(eventData) {
        // update or create user in mongodb
        var query = {
                "DATA.STEAM_ID": eventData.DATA.STEAM_ID,
                "steam.profile.id": eventData.STEAM_ID
            },
            update = {
                $setOnInsert: {
                    steam: {
                        profile: {
                            id: eventData.STEAM_ID
                        }
                    },
                    // this really needs to go
                    ELO: {
                        DUEL: 1200
                    }
                }
            },
            options = {
                upsert: true
            };

        players.update(query, update, options);

        // add user to online players
        redis.sadd('online_players', eventData.DATA.STEAM_ID);
        redis.sadd('players', eventData.DATA.STEAM_ID);
        redis.publish("user_connected", eventData.DATA.STEAM_ID);
    }
}

module.exports = onPlayerConnect;