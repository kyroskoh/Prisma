const handleDatabaseError = require("../functions/handle-database-error.js");
const resolveChannel = require("../functions/resolve-channel.js");

module.exports = {
	commands: [
		"channelinfo",
		"channel",
		"ci"
	],
	description: "View specific information about a channel.",
	usage: "channelinfo [#channel | channel ID | channel name]",
	category: "Information",
	hidden: false,
	execute: (bot, r, msg, args) => {
		if (msg.channel.type === "dm") return msg.channel.send({
			embed: {
				title: "Error!",
				color: 0xE50000,
				description: "This command cannot be used in a Direct Message."
			}
		});
		if (args.length > 0) {
			resolveChannel(bot, args.join(" ")).then((channel) => {
				msg.channel.send({
					embed: {
						title: "Channel Information",
						color: 3066993,
						fields: [
							{
								name: "Name",
								value: "#" + channel.name,
								inline: true
							},
							{
								name: "ID",
								value: channel.id,
								inline: true
							},
							{
								name: "Topic",
								value: ((channel.topic) ? channel.topic : "No Topic"),
								inline: true
							},
							{
								name: "Type",
								value: ((channel.type === "text") ? "Text" : "Voice"),
								inline: true
							},
							{
								name: "Position",
								value: "#" + (channel.position + 1),
								inline: true
							},
							{
								name: "Created At",
								value: new Date(channel.createdAt).toUTCString(),
								inline: true
							}
						]
					}
				});
			}).catch(() => {
				msg.channel.send({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "Unable to find any channels by that query."
					}
				});
			});
		} else {
			msg.channel.send({
				embed: {
					title: "Channel Information",
					color: 3066993,
					fields: [
						{
							name: "Name",
							value: "#" + msg.channel.name,
							inline: true
						},
						{
							name: "ID",
							value: msg.channel.id,
							inline: true
						},
						{
							name: "Topic",
							value: ((msg.channel.topic) ? msg.channel.topic : "No Topic"),
							inline: true
						},
						{
							name: "Type",
							value: ((msg.channel.type === "text") ? "Text" : "Voice"),
							inline: true
						},
						{
							name: "Position",
							value: "#" + (msg.channel.position + 1),
							inline: true
						},
						{
							name: "Created At",
							value: new Date(msg.channel.createdAt).toUTCString(),
							inline: true
						}
					]
				}
			});
		}
	}
};