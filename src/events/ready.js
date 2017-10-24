const log = require("../managers/logger.js");
const steam = require("../functions/steam.js");
const updatePresence = require("../functions/update-presence.js");
const config = require("../config.json");
const handleDatabaseError = require("../functions/handle-database-error.js");
const c4 = require("../functions/connect-4.js");
const dashboard = require("../website/index.js");

module.exports = (bot, r) => {
	bot.on("ready", () => {
		log(bot.user.username + " is ready! (" + (Date.now() - bot.startuptime) + "ms)");
		process.on("unhandledRejection", (error) => {
			if (error.name === "DiscordAPIError") {
				if (error.code === 50013) return;
				if (error.code === 50001) return;
				if (error.code === 50007) return;
			}
			console.error(error);
		});
		process.on("uncaughtException", console.error);
		if (bot.shard.id === 0) dashboard(bot, r);
		steam();
		bot.guilds.map((g) => {
			g.data = {};
			g.data.prefix = config.prefix;
		});
		r.table("prefixes").run((error, response) => {
			if (error) return handleDatabaseError(error);
			response.map((v) => {
				if (bot.guilds.get(v.id)) bot.guilds.get(v.id).data = {
					prefix: v.prefix
				};
			});
		});
		r.table("connect4").run((error, response) => {
			if (error) return handleDatabaseError(error);
			response.map((v) => {
				c4.add(v.id);
				const channel = bot.channels.get(v.channelID);
				if (channel) {
					channel.fetchMessage(v.id).then((m) => {
						m.data = {
							connect4: true
						};
					}).catch(() => {});
				}
			});
		});
		updatePresence(bot);
	});
};