var Discord = require("discord.js");
var dateformat = require("dateformat");
var config = require(__dirname + "/config.json");
var log = require(__dirname + "/managers/logger.js");

var shard = new Discord.ShardingManager(__dirname + "/index.js", {
    totalShards: "auto",
    token: config.token,
    respawn: true
});

shard.on("launch", s => {
    log("Launching shard " + (s.id + 1) + "/" + shard.totalShards);
});

shard.spawn();