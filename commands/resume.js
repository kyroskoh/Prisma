const config = require("../config.json");

module.exports = {
	commands: [
		"resume"
	],
	description: "Resume plaing music in your voice channel.",
	usage: "resume",
	category: "Music",
	hidden: false,
	execute: (bot, r, msg, args) => {
		if (msg.channel.type === "dm") return msg.channel.send({
			embed: {
				title: "Error!",
				color: 0xE50000,
				description: "This command cannot be used in a Direct Message."
			}
		});
		if (msg.guild.members.get(bot.user.id).voiceChannel) {
			if (msg.member.voiceChannel) {
				if (msg.guild.members.get(bot.user.id).voiceChannel.id === msg.member.voiceChannel.id) {
					if (msg.member.voiceChannel.queue.songs[0].userID === msg.author.id || msg.member.hasPermission("MANAGE_CHANNELS") || config.trusted.indexOf(msg.author.id) > -1) {
						msg.member.voiceChannel.queue.pipe.resume();
						msg.channel.send({
							embed: {
								title: "Resumed!",
								color: 3066993,
								description: "Resumed playing music in `" + msg.member.voiceChannel.name + "`."
							}
						});
					} else {
						msg.channel.send({
							embed: {
								title: "Error!",
								color: 0xE50000,
								description: "You do not have permission to execute this command. You must either be the song requester or have the `Manage Channels` permission."
							}
						});
					}
				} else {
					msg.channel.send({
						embed: {
							title: "Error!",
							color: 0xE50000,
							description: "I am not in the same voice channel as you."
						}
					});
				}
			} else {
				msg.channel.send({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "You must be in a voice channel to use this command."
					}
				});
			}
		} else {
			msg.channel.send({
				embed: {
					title: "Error!",
					color: 0xE50000,
					description: "I am not in a voice channel. Play something with `" + ((msg.guild) ? msg.guild.data.prefix : config.prefix) + "play <search>`."
				}
			});
		}
	}
};