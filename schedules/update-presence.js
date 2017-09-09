const updatePresence = require("../functions/update-presence.js");

module.exports = {
	interval: 30000,
	execute: (bot) => {
		updatePresence(bot);
	}
}