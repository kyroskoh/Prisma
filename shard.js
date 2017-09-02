var Discord = require("discord.js");
var dateformat = require("dateformat");
var config = require("./config.json");
var log = require("./managers/logger.js");

var shard = new Discord.ShardingManager("./index.js", {
    totalShards: "auto",
    token: config.token,
    respawn: true
});

shard.on("launch", s => {
    log("Launching shard " + (s.id + 1) + "/" + shard.totalShards);
});

shard.spawn();