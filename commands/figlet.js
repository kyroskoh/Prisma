const figlet = require("figlet");

module.exports = {
	commands: [
		"figlet"
	],
	description: "Turns your text into a figlet.",
	usage: "figlet <text>",
	category: "Fun",
	hidden: false,
	execute: (bot, r, msg, args) => {
		if (args.length > 0) {
			figlet(args.join(" "), (error, data) => {
				if (error) {
					msg.channel.send({
						embed: {
							title: "Error!",
							color: 3066993,
							description: "An unexpected error occured while generating figlet."
						}
					});
					console.error("Failed to generate figlet.", error);
				}
				msg.channel.send("```\n" + data + "```");
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
	}
};