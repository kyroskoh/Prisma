module.exports = {
	commands: [
		"choose",
		"choice"
	],
	description: "Have the bot choose one thing over another.",
	usage: "choose <choice 1>; <choice 2>; <choice 3>",
	category: "Utility",
	hidden: false,
	execute: (bot, r, msg, args) => {
		if (args.length > 0) {
			const choices = args.join(" ").split(";").map((v) => v.trim());
			msg.channel.send({
				embed: {
					title: "Choice",
					color: 3066993,
					description: choices[Math.floor(Math.random() * choices.length)]
				}
			});
		} else {
			msg.channel.send({
				embed: {
					title: "Error!",
					color: 0xE50000,
					description: "Missing `<choice 1>; <choice 2>; <choice 3>` option."
				}
			});
		}
	}
};