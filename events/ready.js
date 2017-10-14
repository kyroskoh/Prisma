const log = require("../managers/logger.js");
const express = require("express");
const generateWebsiteStats = require("../functions/generate-website-stats.js");
const steam = require("../functions/steam.js");
const updatePresence = require("../functions/update-presence.js");
const config = require("../config.json");
const handleDatabaseError = require("../functions/handle-database-error.js");
const c4 = require("../functions/connect-4.js");

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
		if (bot.shard.id === 0) {
			const app = express();
			app.use((req, res, next) => {
				res.setHeader("Access-Control-Allow-Origin", "*");
				res.setHeader("Access-Control-Allow-Methods", "GET");
				res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
				res.setHeader("Access-Control-Allow-Credentials", true);
				next();
			});
			app.get("/stats", (req, res) => {
				generateWebsiteStats(bot, r).then((r) => res.send(r)).catch((error) => {
					console.error(error);
					res.send({
						error
					});
				});
			});
			app.get("/commands", (req, res) => {
				let commands = Object.keys(bot.commands).filter((c) => !bot.commands[c].hidden);
				let categorized = {};
				commands.map((c) => {
					if (!(bot.commands[c].category in categorized)) categorized[bot.commands[c].category] = [];
					categorized[bot.commands[c].category].push({
						usage: bot.commands[c].usage,
						command: bot.commands[c].commands[0],
						aliases: bot.commands[c].commands.slice(1),
						description: bot.commands[c].description
					});
				});
				res.send(categorized);
			});
			app.listen(83, (error) => {
				if (error) {
					if (error.code !== "EADDRINUSE" && error.code !== "EACCES") throw new error;
				}
				log("Express server listening on port 83.");
			});
		}
		steam();
		bot.guilds.map((g) => {
			g.data = {};
			g.data.prefix = config.prefix;
		});
		r.table("prefixes").run((error, response) => {
			if (error) return handleDatabaseError(error);
			response.map((v) => {
				if (bot.guilds.get(v.serverID)) bot.guilds.get(v.serverID).data.prefix = v.prefix;
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