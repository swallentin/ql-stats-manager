function onEvent(mongo, redis, log) {
    var events = mongo.collection('events');
    return function (eventData) {
        log.info(eventData.TYPE, eventData.SERVER.name);
        events.insert(eventData);
    };
}

module.exports = onEvent;