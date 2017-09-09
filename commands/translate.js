const translate = require("google-translate-api");

module.exports = {
	commands: [
		"translate",
		"trans"
	],
	description: "Translate text from one language to another.",
	usage: "translate <language> <text>",
	category: "Utility",
	hidden: false,
	execute: (bot, r, msg, args) => {
		if (args.length > 0) {
			if (args.length > 1) {
				translate(args.slice(1).join(" "), {
					to: args[0]
				}).then((response) => {
					msg.channel.send({
						embed: {
							title: "Translated Text",
							color: 3066993,
							description: response.text
						}
					});
				}).catch((error) => {
					msg.channel.send({
						embed: {
							title: "Error!",
							color: 0xE50000,
							description: "An error occured while translating."
						}
					});
				});
			} else {
				msg.channel.send({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "Missing `<text>` option."
					}
				});
			}
		} else {
			msg.channel.send({
				embed: {
					title: "Error!",
					color: 0xE50000,
					description: "Missing `<language>` option."
				}
			});
		}
	}
};