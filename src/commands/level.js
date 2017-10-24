const snekfetch = require("snekfetch");
const handleDatabaseError = require("../functions/handle-database-error.js");

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
		msg.channel.send({
			embed: {
				title: "Error!",
				color: 0xE50000,
				description: "Coming soon!"
			}
		});
		if (args.length > 0) {
			// todo
		} else {
			/* r.table("levels").get(msg.author.id).run((error, response) => {
				if (error) return handleDatabaseError(error, msg);
				msg.channel.send({
					embed: {
						title: "Level",
						color: 3066993,
						fields: [
							{
								name: "Level",
								value: (response) ? response.level : 0,
								inline: true
							},
							{
								name: "XP",
								value: (response) ? (response.xp) : "0 / 50",
								inline: true
							},
							{
								name: "XP Until Next Lvl.",
								value: (response) ? response.level : 0,
								inline: true
							}
						]
					}
				})
			}) */
		}
	}
};