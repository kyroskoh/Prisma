const snekfetch = require("snekfetch");
const config = require("../config.json");
const resolveUser = require("../functions/resolve-user.js");

module.exports = {
	commands: [
		"botinfo",
		"bot"
	],
	description: "Get information about a bot.",
	usage: "botinfo <@bot | bot ID | bot username>",
	category: "Information",
	hidden: false,
	execute: (bot, r, msg, args) => {
		if (args.length > 0) {
			resolveUser(bot, args.join(" ")).then((user) => {
				if (!user.bot) return msg.channel.send({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "That user is not a bot."
					}
				});
				snekfetch.get("http://bots.discord.pw/api/bots/" + user.id + "/").set("Authorization", config.api_keys.bot_list["bots.discord.pw"]).then((body) => {
					msg.channel.send({
						embed: {
							title: "Bot Information",
							color: 3066993,
							fields: [
								{
									name: "Bot",
									value: user.tag,
									inline: true
								},
								{
									name: "Description",
									value: body.body.description,
									inline: true
								},
								{
									name: "Library",
									value: body.body.library,
									inline: true
								},
								{
									name: "Prefix",
									value: body.body.prefix,
									inline: true
								},
								{
									name: "Website",
									value: (body.body.website) ? body.body.website : "No Website",
									inline: true
								},
								{
									name: "Owner(s)",
									value: body.body.owner_ids.map((id) => "<@" + id + ">").join(" "),
									inline: true
								}
							]
						}
					});
				}).catch((e) => {
					if (e.status !== 404) {
						msg.channel.send({
							embed: {
								title: "Error!",
								color: 0xE50000,
								description: "An unexpected error occured while attempting to get information on that bot."
							}
						});
						console.error("Failed to get information on bot.", e.message);
						return;
					}
					snekfetch.get("http://discordbots.org/api/bots/" + user.id + "/").then((body) => {
						msg.channel.send({
							embed: {
								title: "Bot Information",
								color: 3066993,
								fields: [
									{
										name: "Bot",
										value: user.tag,
										inline: true
									},
									{
										name: "Description",
										value: body.body.shortdesc,
										inline: true
									},
									{
										name: "Library",
										value: body.body.lib,
										inline: true
									},
									{
										name: "Prefix",
										value: body.body.prefix,
										inline: true
									},
									{
										name: "Website",
										value: (body.body.website) ? body.body.website : "No Website",
										inline: true
									},
									{
										name: "Owner(s)",
										value: body.body.owners.map((id) => "<@" + id + ">").join(" "),
										inline: true
									}
								]
							}
						});
					}).catch((e) => {
						if (e.status === 404) return msg.channel.send({
							embed: {
								title: "Error!",
								color: 0xE50000,
								description: "That bot is not listed on any bot list websites."
							}
						});
						msg.channel.send({
							embed: {
								title: "Error!",
								color: 0xE50000,
								description: "An unexpected error occured while attempting to get information on that bot."
							}
						});
						console.error("Failed to get information on bot.", e.message);
					});
				});
			}).catch(() => {
				msg.channel.send({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "Unable to find any users by that query."
					}
				});
			});
		} else {
			msg.channel.send({
				embed: {
					title: "Error!",
					description: "Missing `<@bot | bot ID | bot username>` option.",
					color: 0xE50000
				}
			});
		}
	}
};