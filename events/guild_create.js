const updateBotLists = require("../functions/post-server-count.js");
const config = require("../config.json");
const updatePresence = require("../functions/update-presence.js");

module.exports = (bot) => {
	bot.on("guildCreate", (server) => {
		updateBotLists(bot);
		updatePresence(bot);
		server.data = {};
		server.data.prefix = config.prefix;
	});
}