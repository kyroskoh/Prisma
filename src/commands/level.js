const snekfetch = require("snekfetch");

module.exports = {
	commands: [
		"level",
		"rank"
	],
	description: "Check your level and XP.",
	usage: "level [@user | userID | username]",
	category: "",
	hidden: false,
	execute: (bot, r, msg, args) => {
		if (args.length > 0) {
			// todo
		} else {
			r.table("levels")
		}
	}
};