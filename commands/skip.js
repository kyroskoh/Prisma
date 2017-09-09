const config = require("../config.json");

module.exports = {
	commands: [
		"skip",
		"s"
	],
	description: "Skips the current song playing.",
	usage: "skip",
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
		if (msg.member.voiceChannel) {
			if (msg.guild.me.voiceChannel) {
				if (msg.guild.me.voiceChannel.id === msg.member.voiceChannel.id) {
					if (msg.member.voiceChannel.queue.songs[0].userID === msg.author.id || config.trusted.indexOf(msg.author.id) > -1 || msg.member.voiceChannel.members.filter((m) => !m.user.bot).size / 2 <= msg.member.voiceChannel.queue.vote_skips.length) {
						msg.member.voiceChannel.queue.pipe.end();
					} else {
						if (msg.member.voiceChannel.queue.vote_skips.indexOf(msg.author.id) > -1) {
							msg.channel.send({
								embed: {
									title: "Error!",
									color: 0xE50000,
									description: "You have already voted to skip. I need `" + Math.ceil(msg.member.voiceChannel.members.filter((m) => !m.user.bot && m.user.id !== msg.author.id).size / 2) + "` more votes to skip."
								}
							});
						} else {
							msg.member.voiceChannel.queue.vote_skips.push(msg.author.id);
							msg.channel.send({
								embed: {
									title: "Vote Skipped!",
									color: 3066993,
									description: "You have voted to skip the current song. You need `" + Math.ceil(msg.member.voiceChannel.members.filter((m) => !m.user.bot && m.user.id !== msg.author.id).size / 2) + "` more requests to skip."
								}
							});
						}
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
						description: "I am not in a voice channel. Play something with `" + ((msg.guild) ? msg.guild.data.prefix : config.prefix) + "play <search>`."
					}
				});
			}
		} else {
			msg.channel.send({
				embed: {
					title: "Error!",
					color: 0xE50000,
					description: "You must be in a voice channel in order to use this command."
				}
			});
		}
	}
};