function onMatchStarted(matches, client) {
    return function (eventData) {
        // add document to mongodb matches collection
        matches.insert(eventData);
        client.sadd('current_matches', eventData.DATA.MATCH_GUID);
        client.publish("match_started", eventData.DATA.MATCH_GUID);
    };
}

modules.exports = onMatchStarted;