const pi = require("../data/pi.js");

module.exports = {
	commands: [
		"pi"
	],
	description: "Get all 1,000,000 digits of Pi.",
	usage: "pi",
	category: "Fun",
	hidden: false,
	execute: (bot, r, msg) => {
		msg.channel.send({
			embed: {
				title: "Pi",
				color: 3066993,
				description: "```\n" + pi[0] + "```",
				footer: {
					text: "Page 1 / " + pi.length
				}
			}
		}).then((m) => {
			m.react("⬅").then(() => {
				m.react("➡").then(() => {
					m.data = {
						pi: true,
						userID: msg.author.id,
						page: 1
					};
				});
			});
		});
	}
};