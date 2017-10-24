// const youtubeNode = require("youtube-node");
// const config = require("../config.json");
// const ytdl = require("ytdl-core");
// const getyoutubeid = require("get-youtube-id");
// const humanizeduration = require("humanize-duration");
// const youtube = new youtubeNode();
// youtube.setKey(config.api_keys.youtube);

module.exports = {
	commands: [
		"play",
		"p"
	],
	description: "Play music in your voice channel.",
	usage: "play <YouTube URL | search query>",
	category: "Music",
	hidden: false,
	execute: (bot, r, msg/*, args*/) => {
		return msg.channel.send({
			embed: {
				title: "Error!",
				color: 0xE50000,
				description: "Sorry, but our current VPS is unable to handle music. If you are able to donate, please do so at https://patreon.com/passthemayo."
			}
		});
		/* if (msg.channel.type === "dm") return msg.channel.send({
			embed: {
				title: "Error!",
				color: 0xE50000,
				description: "This command cannot be used in a Direct Message."
			}
		});
		if (msg.member.voiceChannel) {
			if (msg.content.split(" ").length > 1) {
				if (msg.content.split(" ").slice(1).join(" ").match(/(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/)) {
					ytdl.getInfo(msg.content.split(" ").slice(1).join(" "), (error, callback) => {
						if (error) return msg.channel.send({
							embed: {
								title: "Error!",
								color: 0xE50000,
								description: "An unexpected error occured while getting information on that YouTube video."
							}
						});
						if (msg.member.voiceChannel.queue) {
							if (msg.member.voiceChannel.queue.songs.length > 24) return msg.channel.send({
								embed: {
									title: "Error!",
									color: 0xE50000,
									description: "You can only queue 25 songs at once."
								}
							});
							msg.member.voiceChannel.queue.songs[msg.member.voiceChannel.queue.songs.length] = {
								userID: msg.author.id,
								videoID: getyoutubeid(msg.content.split(" ").slice(1).join(" ")),
								title: callback.title,
								duration: humanizeduration(callback.length_seconds * 1000, {
									language: "shortEn",
									spacer: "",
									round: true,
									delimiter: "",
									languages: {
										shortEn: {
											y: "y",
											mo: "mo",
											w: "w",
											d: "d",
											h: "h",
											m: "m",
											s: "s",
											ms: "ms"
										}
									}
								})
							};
							msg.channel.send({
								embed: {
									title: "Added!",
									color: 3066993,
									description: "Added `" + callback.title + "` to the queue. Position `#" + msg.member.voiceChannel.queue.songs.length + "`."
								}
							});
						} else {
							msg.member.voiceChannel.queue = {
								songs: [
									{
										userID: msg.author.id,
										videoID: getyoutubeid(msg.content.split(" ").slice(1).join(" ")),
										title: callback.title,
										duration: humanizeduration(callback.length_seconds * 1000, {
											language: "shortEn",
											spacer: "",
											delimiter: "",
											languages: {
												shortEn: {
													y: "y",
													mo: "mo",
													w: "w",
													d: "d",
													h: "h",
													m: "m",
													s: "s",
													ms: "ms"
												}
											}
										})
									}
								],
								vote_skips: [],
								leave: false,
								ytdl: null,
								pipe: null
							};
							msg.member.voiceChannel.join().then((stream) => {
								msg.channel.send({
									embed: {
										title: "Joined!",
										color: 3066993,
										description: "Successfully joined `" + msg.member.voiceChannel.name + "`."
									}
								});
								const checkqueue = () => {
									ytdl.getInfo(msg.member.voiceChannel.queue.songs[0].videoID, (error, info) => {
										if (error) {
											msg.channel.send({
												embed: {
													title: "Error!",
													color: 0xE50000,
													description: "An unexpected error occured while fetching video information."
												}
											});
											return msg.member.voiceChannel.leave();
										}
										msg.channel.send({
											embed: {
												title: "Playing...",
												color: 3066993,
												description: "Now playing `" + info.title + "` in your voice channel."
											}
										});
										msg.member.voiceChannel.queue.ytdl = ytdl(msg.member.voiceChannel.queue.songs[0].videoID, {
											filter: "audioonly"
										});
										msg.member.voiceChannel.queue.pipe = stream.playStream(msg.member.voiceChannel.queue.ytdl);
										msg.member.voiceChannel.queue.pipe.once("end", () => {
											msg.member.voiceChannel.queue.ytdl.destroy();
											msg.member.voiceChannel.queue.vote_skips = [];
											msg.member.voiceChannel.queue.ytdl = null;
											msg.member.voiceChannel.queue.songs.shift();
											if (msg.member.voiceChannel.queue.songs.length > 0) {
												checkqueue();
											} else {
												delete msg.member.voiceChannel.queue;
												msg.member.voiceChannel.leave();
												msg.channel.send({
													embed: {
														title: "Queue complete!",
														color: 3066993,
														description: "Queue is empty, left voice channel."
													}
												});
											}
										});
										msg.member.voiceChannel.queue.pipe.once("error", (error) => {
											console.error("Error while playing audio.", error);
											msg.member.voiceChannel.queue.songs.shift();
											if (msg.member.voiceChannel.queue.songs.length > 0) {
												msg.channel.send({
													embed: {
														title: "Error!",
														color: 0xE50000,
														description: "An unexpected error occured while playing audio. Skipping..."
													}
												});
												msg.member.voiceChannel.queue.pipe.end();
											} else {
												msg.member.voiceChannel.leave().then(() => {
													delete msg.member.voiceChannel.queue;
													msg.channel.send({
														embed: {
															title: "Error!",
															color: 0xE50000,
															description: "An unexpected error occured while playing audio. Skipping, but queue is empty, left voice channel."
														}
													});
												}).catch(() => {
													msg.channel.send({
														embed: {
															title: "Error!",
															color: 0xE50000,
															description: "An unexpected error occured while playing audio. Skipping, but queue is empty, and failed to leave voice channel."
														}
													});
												});
											}
										});
										msg.member.voiceChannel.queue.ytdl.on("error", (error) => {
											console.error("Error while playing audio.", error);
											msg.member.voiceChannel.queue.songs.shift();
											if (msg.member.voiceChannel.queue.songs.length > 0) {
												msg.channel.send({
													embed: {
														title: "Error!",
														color: 0xE50000,
														description: "An unexpected error occured while playing audio. Skipping..."
													}
												});
												msg.member.voiceChannel.queue.pipe.end();
											} else {
												msg.member.voiceChannel.leave().then(() => {
													delete msg.member.voiceChannel.queue;
													msg.channel.send({
														embed: {
															title: "Error!",
															color: 0xE50000,
															description: "An unexpected error occured while playing audio. Skipping, but queue is empty, left voice channel."
														}
													});
												}).catch(() => {
													msg.channel.send({
														embed: {
															title: "Error!",
															color: 0xE50000,
															description: "An unexpected error occured while playing audio. Skipping, but queue is empty, and failed to leave voice channel."
														}
													});
												});
											}
										});
									});
								};
								checkqueue();
							}).catch(() => {
								msg.channel.send({
									embed: {
										title: "Error!",
										color: 0xE50000,
										description: "Failed to connect to voice channel."
									}
								});
							});
						}
					});
				} else {
					youtube.search(msg.content.split(" ").slice(1).join(" "), 3, { type: "video" }, (error, results) => {
						if (error) {
							msg.channel.send({
								embed: {
									title: "Error!",
									color: 0xE50000,
									description: "An unexpected error occured while searching for `" + msg.content.split(" ").slice(1).join(" ") + "`."
								}
							})
							return console.error("Failed to search for a video.", error);
						}
						msg.channel.send({
							embed: {
								title: "Select a Video",
								color: 3066993,
								fields: [
									{
										name: ":one: -- " + results.items[0].snippet.title,
										value: "By " + results.items[0].snippet.channelTitle,
										inline: false
									},
									{
										name: ":two: -- " + results.items[1].snippet.title,
										value: "By " + results.items[1].snippet.channelTitle,
										inline: false
									},
									{
										name: ":three: -- " + results.items[2].snippet.title,
										value: "By " + results.items[2].snippet.channelTitle,
										inline: false
									}
								]
							}
						}).then((m) => {
							msg.channel.awaitMessages((m) => m.author.id === msg.author.id, {
								max: 1
							}).then((m) => {
								if (m.first().content.toLowerCase() === "cancel") return msg.channel.send({
									embed: {
										title: "Cancelled",
										color: 3066993,
										description: "Video selector cancelled by user."
									}
								});
								let newevent = Object.create(msg);
								if (m.first().content === "1") {
									newevent.content = config.prefix + "play http://youtube.com/watch?v=" + results.items[0].id.videoId;
									play.execute(bot, r, newevent, newevent.content.split(" ").slice(1));
									m.delete();
								} else if (m.first().content === "2") {
									newevent.content = config.prefix + "play http://youtube.com/watch?v=" + results.items[1].id.videoId;
									play.execute(bot, r, newevent, newevent.content.split(" ").slice(1));
									m.delete();
								} else if (m.first().content === "3") {
									newevent.content = config.prefix + "play http://youtube.com/watch?v=" + results.items[2].id.videoId;
									play.execute(bot, r, newevent, newevent.content.split(" ").slice(1));
									m.delete();
								} else {
									msg.channel.send({
										embed: {
											title: "Error!",
											color: 0xE50000,
											description: "Invalid video number, `" + m.first().content + "`."
										}
									});
								}
							});
						});
					});
				}
			} else {
				msg.channel.send({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "Missing `<YouTube URL | search query>` option."
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
		} */
	}
};

// const play = require("./play.js");