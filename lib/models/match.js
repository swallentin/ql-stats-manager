var mongoose = require('mongoose');
var Player = require('./Player');
var Schema = mongoose.Schema;

var matchSchema = new Schema({
    guid: String,
    owner_id: String,
    server_title: String,
    exit_msg: String,
    map_id: Number,
    gametype: String,
    factory: String,
    factory_title : String,
    aborted: Boolean,
    game_length: Number,
    capture_limit: Number,
    mercy_limit:Number,
    quadhog: Number,
    infected: Number,
    instagib: Number,
    tscore0: Number,
    tscore1: Number,
    score_limit: Number,
    last_lead_change_time: Number
});

//module.exports = mongoose.model('Match', matchSchema);
//{
//    "DATA" : {
//    "ABORTED" : false,
//        "EXIT_MSG" : "Timelimit hit.",
//
//        "CAPTURE_LIMIT" : 8,
//        "FACTORY" : "duel",
//        "FACTORY_TITLE" : "Duel",
//        "FIRST_SCORER" : "inl",
//        "FRAG_LIMIT" : 0,
//        "GAME_TYPE" : "DUEL",
//        "GAME_LENGTH" : 600,
//        "LAST_LEAD_CHANGE_TIME" : 200,
//        "LAST_SCORER" : "auraDiiN",
//        "LAST_TEAMSCORER" : "none",
//        "INFECTED" : 0,
//        "INSTAGIB" : 0,
//        "MAP" : "furiousheights",
//        "MATCH_GUID" : "8eb56455-2dad-4346-babb-1246180fc98a",
//        "MERCY_LIMIT" : 0,
//        "PLAYERS" : [
//        {
//            "NAME" : "Rawbat",
//            "STEAM_ID" : "76561197993085337",
//            "TEAM" : 0
//        },
//        {
//            "NAME" : "Jihker",
//            "STEAM_ID" : "76561198038951702",
//            "TEAM" : 0
//        }
//    ],
//
//        "QUADHOG" : 0,
//        "RESTARTED" : 0,
//
//        "SCORE_LIMIT" : 150,
//        "SERVER_TITLE" : ".se Arte et Marte  #1",
//        "TIME_LIMIT" : 10,
//        "TRAINING" : 0,
//        "TSCORE0" : 0,
//        "TSCORE1" : 0
//
//},
//    "TYPE" : "MATCH_STARTED",
//    "SERVER" : {
//    "name" : "ql-sth-01 #1",
//        "hostname" : "5.150.254.201",
//        "port" : 27960,
//        "password" : ""
//},
//    "EVENT_TIME" : ISODate("2015-11-03T21:38:09.107Z"),
//    "_id" : ObjectId("5639294115cda41604110d07")
//}