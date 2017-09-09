const snekfetch = require("snekfetch");
const config = require("../config.json");

module.exports = {
	commands: [
		"mcserver",
		"minecraftserver"
	],
	description: "View information about a Minecraft server.",
	usage: "mcserver <IP address>[:port]",
	category: "Utility",
	hidden: false,
	execute: (bot, r, msg, args) => {
		if (args.length > 0) {
			snekfetch.get("https://mcapi.ca/query/" + args.join(" ") + "/info").then((body) => {
				if (body.body.error) return msg.channel.send({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "Failed to connect to Minecraft server."
					}
				});
				if (body.body.favicon) {
					snekfetch.post("https://api.imgur.com/3/image").set("Authorization", "Client-ID " + config.api_keys.imgur).send({
						image: body.body.favicon.replace(/^data:image\/png;base64,/,""),
						title: "Minecraft Server Thumbnail Upload",
						name: "icon.png"
					}).then((image) => {
						msg.channel.send({
							embed: {
								title: "Minecraft Server",
								color: 3066993,
								thumbnail: {
									url: "https://i.imgur.com/" + image.body.data.id + ".png"
								},
								fields: [
									{
										name: "IP Address",
										value: body.body.hostname,
										inline: true
									},
									{
										name: "MOTD",
										value: body.body.motd.replace(/§[a-z, 0-9]/g, ""),
										inline: true
									},
									{
										name: "Version",
										value: body.body.version,
										inline: true
									},
									{
										name: "Players",
										value: body.body.players.online + "/" + body.body.players.max,
										inline: true
									}
								]
							}
						});
					}).catch((e) => {
						msg.channel.send({
							embed: {
								title: "Error!",
								color: 0xE50000,
								description: "Failed to upload thumbnail to imgur."
							}
						});
						console.error("Failed to upload thumbnail for Minecraft server.", e);
					});
				} else {
					msg.channel.send({
						embed: {
							title: "Minecraft Server",
							color: 3066993,
							fields: [
								{
									name: "IP Address",
									value: body.body.hostname,
									inline: true
								},
								{
									name: "MOTD",
									value: body.body.motd.replace(/§[a-z, 0-9]/g, ""),
									inline: true
								},
								{
									name: "Version",
									value: body.body.version,
									inline: true
								},
								{
									name: "Players",
									value: body.body.players.online + "/" + body.body.players.max,
									inline: true
								}
							]
						}
					});
				}
			}).catch((error) => {
				msg.channel.send({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "Failed to get information about that server."
					}
				});
				console.error("Failed to get information about a Minecraft server.", error.message);
			});
		} else {
			msg.channel.send({
				embed: {
					title: "Error!",
					color: 0xE50000,
					description: "Missing `<IP address>[:port]` option."
				}
			});
		}
	}
};