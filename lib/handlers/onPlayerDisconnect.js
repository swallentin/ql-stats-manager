function onPlayerDisconnect (mongo, client) {
    return function(eventData) {
      client.srem('online_players', eventData.DATA.STEAM_ID);
      client.publish("user_disconnected", eventData.DATA.STEAM_ID);
  }
}

module.exports = onPlayerDisconnect;