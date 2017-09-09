const snekfetch = require("snekfetch");
const config = require("../config.json");
const util = require("util");

module.exports = (bot) => {
	snekfetch.post("https://discordbots.org/api/bots/" + bot.user.id + "/stats").set("Authorization", config.api_keys.bot_list["discordbots.org"]).send({
		server_count: bot.guilds.size,
		shard_id: bot.shard.id,
		shard_count: bot.shard.count
	}).catch(console.error);
	snekfetch.post("https://bots.discord.pw/api/bots/" + bot.user.id + "/stats").set("Authorization", config.api_keys.bot_list["bots.discord.pw"]).send({
		server_count: bot.guilds.size,
		shard_id: bot.shard.id,
		shard_count: bot.shard.count
	}).catch(() => {});
};