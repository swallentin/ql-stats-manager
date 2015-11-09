function onPlayerStats(player_stats) {
    return function (eventData) {
        player_stats.insert(eventData);
    }
}

module.exports = onPlayerStats;