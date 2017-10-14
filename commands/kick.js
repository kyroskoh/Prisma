const resolveMember = require("../functions/resolve-member.js");

module.exports = {
	commands: [
		"kick"
	],
	description: "Kicks a user from the server.",
	usage: "kick [@user | user ID]",
	category: "Moderation",
	hidden: false,
	execute: (bot, r, msg, args) => {
		if (msg.channel.type === "dm") return msg.channel.send({
			embed: {
				title: "Error!",
				color: 0xE50000,
				description: "This command cannot be used in a Direct Message."
			}
		});
		if (msg.member.hasPermission("KICK_MEMBERS")) {
			if (msg.guild.me.hasPermission("KICK_MEMBERS")) {
				resolveMember(msg.guild, args.join(" "), false).then((member) => {
					if (member.bannable) {
						member.kick("Kicked by " + msg.author.tag + " - " + ((args.length > 0) ? "Reason: " + args.join(" ") : "No reason specified.")).then(() => {
							msg.channel.send({
								embed: {
									title: "Kicked!",
									color: 0xE50000,
									description: "That user has been kicked. Reason: `" + ((args.length > 0) ? args.join(" ") : "No reason specified.") + "`"
								}
							});
						}).catch(() => {
							msg.channel.send({
								embed: {
									title: "Error!",
									color: 0xE50000,
									description: "An unexpected error occured while trying to kick user."
								}
							});
						});
					} else {
						msg.channel.send({
							embed: {
								title: "Error!",
								color: 0xE50000,
								description: "I am unable to kick that user because they are a higher or has the same role as me."
							}
						});
					}
				}).catch(() => {
					msg.channel.send({
						embed: {
							title: "Error!",
							color: 0xE50000,
							description: "I was unable to find any users by that query."
						}
					});
				});
			} else {
				msg.channel.send({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "I do not have permission to kick members. Please give me the `Kick Members` command."
					}
				});
			}
		} else {
			msg.channel.send({
				embed: {
					title: "Error!",
					color: 0xE50000,
					description: "You do not have permission to use this command. This command requires the `Kick Members` permission."
				}
			});
		}
	}
};