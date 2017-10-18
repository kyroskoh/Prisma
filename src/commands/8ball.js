const responses = require("../data/eightball.json");

module.exports = {
	commands: [
		"8ball",
		"eightball"
	],
	description: "Ask the magic 8-ball a question.",
	usage: "8ball <question>",
	category: "Fun",
	hidden: false,
	execute: (bot, r, msg, args) => {
		if (args.length > 0) {
			msg.channel.send({
				embed: {
					title: "Magic 8-Ball",
					description: responses[Math.round(Math.random() * responses.length)],
					color: 3066993
				}
			});
		} else {
			msg.channel.send({
				embed: {
					title: "Error!",
					description: "Missing `<question>` option.",
					color: 0xE50000
				}
			});
		}
	}
};