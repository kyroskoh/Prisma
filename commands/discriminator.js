module.exports = {
	commands: [
		"discriminator",
		"discrim"
	],
	description: "Find users with the same discriminator as you.",
	usage: "discriminator <discrim> [page #]",
	category: "Information",
	hidden: false,
	execute: (bot, r, msg, args) => {
		if (args.length < 1) args[0] = msg.author.discriminator;
		if (isNaN(Number(args[0]))) return msg.channel.send({
			embed: {
				title: "Error!",
				color: 0xE50000,
				description: "`" + args[0] + "` is not a valid number."
			}
		});
		if (Number(args[0]) > 9999) return msg.channel.send({
			embed: {
				title: "Error!",
				color: 0xE50000,
				description: "Discriminators are four digit numbers."
			}
		});
		if (Number(args[0]) < 1) return msg.channel.send({
			embed: {
				title: "Error!",
				color: 0xE50000,
				description: "Discriminators do not go below 1."
			}
		});
		const users = bot.users.filter((u) => u.discriminator === args[0] && u.id !== msg.author.id && !u.bot).map((u) => u.tag);
		if (users.length > 0) {
			if (args.length > 1) {
				if (isNaN(Number(args[1]))) return msg.channel.send({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "`" + args[0] + "` is not a valid number."
					}
				});
				if (Number(args[1]) < 1) return msg.channel.send({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "The page number cannot be less than 1."
					}
				});
				if (Number(args[1]) > Math.ceil(users.length / 25)) return msg.channel.send({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "Page `" + args[1] + "` does not exist."
					}
				});
				msg.channel.send({
					embed: {
						title: "Discriminators",
						color: 3066993,
						description: users.slice((Number(args[1]) * 25) - 25, Number(args[1]) * 25).join("\n"),
						footer: {
							text: "Page " + args[1] + " / " + Math.ceil(users.length / 25)
						}
					}
				});
			} else {
				msg.channel.send({
					embed: {
						title: "Discriminators",
						color: 3066993,
						description: users.slice(0, 25).join("\n"),
						footer: {
							text: "Page 1 / " + Math.ceil(users.length / 25)
						}
					}
				});
			}
		} else {
			msg.channel.send({
				embed: {
					title: "Error!",
					color: 0xE500000,
					description: "There are no users found with that discriminator."
				}
			});
		}
	}
};