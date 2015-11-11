function onPlayerStats(mongo, redis) {
    var player_stats = mongo.collection('player_stats');
    return function (eventData) {
        player_stats.insert(eventData);
    }
}

module.exports = onPlayerStats;