const config = require("../config.json");
const cleverbot = require("cleverbot.io");
const clever = new cleverbot(config.api_keys.cleverbot[0], config.api_keys.cleverbot[1]);
clever.create((error, session) => {
	if (error) throw new error();
	clever.setNick(session);
});

module.exports = {
	commands: [
		"cleverbot",
		"clever",
		"askclever"
	],
	description: "Ask the \"intelligent\" Cleverbot API a question.",
	usage: "cleverbot <question>",
	category: "Fun",
	hidden: false,
	execute: (bot, r, msg, args) => {
		if (args.length > 0) {
			msg.channel.send({
				embed: {
					title: "Error!",
					color: 0xE50000,
					description: "Cleverbot API is currently broken. Please try again later."
				}
			});
		} else {
			msg.channel.send({
				embed: {
					title: "Error!",
					color: 0xE50000,
					description: "Missing `<question>` option."
				}
			});
		}
	}
};