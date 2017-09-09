const snekfetch = require("snekfetch");
const gm = require("gm");
const resolveUser = require("../functions/resolve-user.js");

module.exports = {
	commands: [
		"blur"
	],
	description: "Blurs an image a certain percent.",
	usage: "blur [amount] [url | @user | username | userID]",
	category: "Image",
	hidden: false,
	execute: (bot, r, msg, args) => {
		function next(url) {
			let amount = 15;
			if (args.length > 0) {
				if (isNaN(Number(args[0]))) return msg.channel.send({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "`" + args[1] + "` is not a valid number."
					}
				});
				if (Number(args[0]) > 100) return msg.channel.send({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "The blur amount cannot be greater than 100%."
					}
				});
				if (Number(args[0]) < 1) return msg.channel.send({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "The blur amount cannot be less than 1%."
					}
				});
				amount = Number(args[0]);
			}
			snekfetch.get(url).then((body) => {
				try {
					gm(body.body).blur(amount, amount).toBuffer((error, buffer) => {
						if (error) return console.error("Failed to blur image.", error);
						msg.channel.send({
							files: [
								{
									attachment: buffer,
									name: "image.png"
								}
							]
						});
					});
				} catch (e) {
					msg.channel.send({
						embed: {
							title: "Error!",
							color: 0xE50000,
							description: "An error occured while editing image."
						}
					});
				}
			}).catch((error) => {
				msg.channel.send({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "Failed to load image. `" + error.message + "`"
					}
				});
			});
		}
		if (args.length > 1) {
			if (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(args[1])) {
				next(args[1]);
			} else {
				resolveUser(bot, args[1]).then((user) => {
					next(user.avatarURL);
				}).catch(() => {
					msg.channel.send({
						embed: {
							title: "Error!",
							color: 0xE50000,
							description: "Unable to find any users by that search."
						}
					});
				});
			}
		} else {
			next(msg.author.avatarURL);
		}
	}
};