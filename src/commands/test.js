const config = require("../config.json");

module.exports = {
	commands: [
		"test"
	],
	description: "A test command for new features.",
	usage: "test",
	category: "Image",
	hidden: true,
	execute: (bot, r, msg) => {
		if (msg.author.id !== config.trusted[0]) return;
		// do stuff
	}
};