var config = require('config'),
    settings = config.get('settings'),
    Elo = require('arpad'),
    elo = new Elo(settings.elo.duel);

function onMatchReport  (mongo, redis) {

    var players = mongo.collection('players'),
        player_stats = mongo.collection('player_stats'),
        reports = mongo.collection('reports');

    return function (eventData) {
        // update mongodb matches collection with match report
        reports.insert(eventData);
        redis.sadd('matches', eventData.DATA.MATCH_GUID);
        redis.srem('current_matches', eventData.DATA.MATCH_GUID);

        if(eventData.DATA.GAME_TYPE === 'DUEL' && !eventData.DATA.ABORTED) {
            var winningPlayerStats,
                losingPlayerStats,
                winningPlayer,
                losingPlayer,
                winningPlayerOldElo,
                losingPlayerOldElo,
                winningPlayerNewElo,
                losingPlayerNewElo;

            player_stats.find({
                "DATA.RANK": {
                    $in: [1,2]
                },
                "DATA.MATCH_GUID": eventData.DATA.MATCH_GUID
            }).toArray(function (err, results) {
                if (results.length > 1 && results[0].DATA && results[1].DATA )  {
                    winningPlayerStats = results[0].DATA.RANK === 1 ? results[0] : results[1];
                    losingPlayerStats = results[0].DATA.RANK === 2 ? results[0] : results[1];

                    players.find({
                        "DATA.STEAM_ID": {
                            $in: [
                                winningPlayerStats.DATA.STEAM_ID,
                                losingPlayerStats.DATA.STEAM_ID
                            ]
                        }
                    }).toArray(function(err, results) {
                        winningPlayer = results[0].DATA.STEAM_ID === winningPlayerStats.DATA.STEAM_ID ? results[0] : results[1];
                        losingPlayer = results[0].DATA.STEAM_ID === losingPlayerStats.DATA.STEAM_ID ? results[0] : results[1];


                        winningPlayerOldElo = (winningPlayer.ELO && winningPlayer.ELO.DUEL) ?  winningPlayer.ELO.DUEL : 1200;
                        losingPlayerOldElo = (losingPlayer.ELO && losingPlayer.ELO.DUEL) ?  losingPlayer.ELO.DUEL : 1200;

                        winningPlayerNewElo = elo.newRatingIfWon(winningPlayerOldElo, losingPlayerOldElo);
                        losingPlayerNewElo = elo.newRatingIfLost(losingPlayerOldElo, winningPlayerOldElo);

                        var winningPlayerQuery = {
                                "DATA.STEAM_ID": winningPlayerStats.DATA.STEAM_ID
                            },
                            losingPlayerQuery = {
                                "DATA.STEAM_ID": losingPlayerStats.DATA.STEAM_ID
                            },
                            winningPlayerUpdate = {
                                $set: {
                                    ELO: {
                                        DUEL: winningPlayerNewElo
                                    }
                                }
                            },
                            losingPlayerUpdate = {
                                $set: {
                                    ELO: {
                                        DUEL: losingPlayerNewElo
                                    }
                                }
                            };
                        players.update(winningPlayerQuery, winningPlayerUpdate);
                        players.update(losingPlayerQuery, losingPlayerUpdate);
                        console.log("win:", winningPlayerStats.DATA.STEAM_ID, 'old elo:', winningPlayerOldElo, 'new elo:', winningPlayerNewElo);
                        console.log("loss:", losingPlayerStats.DATA.STEAM_ID, 'old elo:', losingPlayerOldElo, 'new elo:', losingPlayerNewElo);
                    });
                }

            });
        }

        redis.publish("match_completed", eventData.DATA.MATCH_GUID);    }
}

module.exports = onMatchReport;