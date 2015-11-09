function onPlayerConnect(players, client) {
    return function(eventData) {
        // add user to online players
        client.sadd('online_players', eventData.DATA.STEAM_ID);
        // update or create user in mongodb
        var query = {
                "DATA.STEAM_ID": eventData.DATA.STEAM_ID
            },
            update = {
                $set: eventData,
                $setOnInsert: {
                    ELO: {
                        DUEL: 1200
                    }
                }
            },
            options = {
                upsert: true
            };

        players.update(query, update, options);
        client.sadd('players', eventData.DATA.STEAM_ID);
        client.publish("user_connected", eventData.DATA.STEAM_ID);
    }
}

module.exports = onPlayerConnect;