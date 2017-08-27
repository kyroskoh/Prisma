const datadog = require("dogapi");
const config = require("../config.json");
const handleDatabaseError = require("../functions/handle-database-error.js");

datadog.initialize(config.api_keys.datadog);

module.exports = {
    interval: (1000 * 60 * 15),
    execute: (bot, database) => {
        bot.shard.broadcastEval("process.memoryUsage().heapUsed").then(mem => {
            datadog.metric.send("bots.prisma.memory", (mem.reduce((a, b) => a + b, 0) / 1024 / 1024).toFixed(1));
        });
        bot.shard.fetchClientValues("voiceConnections.size").then(vc => {
            datadog.metric.send("bots.prisma.voiceconnections", vc.reduce((a, b) => a + b, 0));
        });
        bot.shard.fetchClientValues("guilds.size").then(guilds => {
            datadog.metric.send("bots.prisma.guilds", guilds.reduce((a, b) => a + b, 0));
        });
    }
};