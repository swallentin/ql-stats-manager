function onMatchStarted(mongo, redis) {
    var matches = mongo.collection('matches');
    return function (eventData) {
        // add document to mongodb matches collection
        matches.insert(eventData);
        redis.sadd('current_matches', eventData.DATA.MATCH_GUID);
        redis.publish("match_started", eventData.DATA.MATCH_GUID);
    };
}

module.exports = onMatchStarted;