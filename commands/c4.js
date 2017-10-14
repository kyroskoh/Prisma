const resolveUser = require("../functions/resolve-user.js");
const handleDatabaseError = require("../functions/handle-database-error.js");
const config = require("../config.json");
const c4 = require("../functions/connect-4.js");

module.exports = {
	commands: [
		"c4",
		"connect4",
		"connectfour"
	],
	description: "Play Connect 4 with another person.",
	usage: "c4 <@user | userID | username | cancel>",
	category: "Fun",
	hidden: false,
	execute: (bot, r, msg, args) => {
		if (args.length > 0) {
			if (args[0].toLowerCase() === "cancel") {
				r.table("connect4").filter(r.row("user1")("id").eq(msg.author.id).or(r.row("user2")("id").eq(msg.author.id))).run((error, response) => {
					if (error) return handleDatabaseError(error, msg);
					if (response.length > 0) {
						r.table("connect4").filter(r.row("user1")("id").eq(msg.author.id).or(r.row("user2")("id").eq(msg.author.id))).delete().run((error) => {
							if (error) return handleDatabaseError(error, msg);
							msg.channel.send({
								embed: {
									title: "Cancelled Game",
									color: 3066993,
									description: "You have cancelled your Connect 4 game."
								}
							});
						});
					}
				});
			} else {
				resolveUser(bot, args.join(" ")).then((user) => {
					if (user.id === msg.author.id) return msg.channel.send({
						embed: {
							title: "Error!",
							color: 0xE50000,
							description: "You can't start a Connect 4 game with yourself!"
						}
					});
					r.table("connect4").filter(r.row("user1")("id").eq(msg.author.id).or(r.row("user2")("id").eq(msg.author.id))).run((error, response) => {
						if (error) return handleDatabaseError(error, msg);
						if (response.length > 0) {
							msg.channel.send({
								embed: {
									title: "Error!",
									color: 0xE50000,
									description: "You are already in a Connect 4 game. Use `" + ((msg.guild) ? msg.guild.data.prefix : config.prefix) + "c4 cancel` to cancel your current game."
								}
							});
						} else {
							msg.channel.send({
								embed: {
									title: "Connect 4",
									color: 3066993,
									description: "**" + msg.author.tag + "**'s turn.\n\n" + Array(7).fill(Array(6).fill(":black_circle:").join("   |   ")).join("\n")
								}
							}).then((m) => {
								r.table("connect4").insert({
									id: m.id,
									user1: {
										id: msg.author.id,
										tag: msg.author.tag,
									},
									user2: {
										id: user.id,
										tag: user.tag,
									},
									turn: 1,
									game: [
										[0, 0, 0, 0, 0, 0],
										[0, 0, 0, 0, 0, 0],
										[0, 0, 0, 0, 0, 0],
										[0, 0, 0, 0, 0, 0],
										[0, 0, 0, 0, 0, 0],
										[0, 0, 0, 0, 0, 0],
										[0, 0, 0, 0, 0, 0]
									]
								}).run((error) => {
									if (error) return handleDatabaseError(error, msg);
									c4.add(m.id);
									m.react("1⃣").then(() => m.react("2⃣").then(() => m.react("3⃣").then(() => m.react("4⃣").then(() => m.react("5⃣").then(() => m.react("6⃣"))))));
								});
							});
						}
					});
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
			msg.channel.send({
				embed: {
					title: "Error!",
					color: 0xE50000,
					description: "Missing `<@user | userID | username>` option."
				}
			});
		}
	}
};