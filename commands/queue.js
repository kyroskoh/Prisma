const humanizeduration = require("humanize-duration");

module.exports = {
    commands: [
        "queue",
        "songs"
    ],
    description: "View the list of songs queued to play.",
    usage: "queue",
    category: "Music",
    hidden: false,
    execute: (bot, database, msg, args) => {
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
                    const queue = msg.member.voiceChannel.queue.songs.map(s => s.title + " (" + s.duration + ")");
                    msg.channel.send({
                        embed: {
                            title: "Queue",
                            color: 3066993,
                            fields: [
                                {
                                    name: "Now Playing",
                                    value: msg.member.voiceChannel.queue.songs[0].title + " (" + humanizeduration(msg.member.voiceChannel.queue.pipe.totalStreamTime, {
                                        language: 'shortEn',
                                        spacer: "",
                                        delimiter: "",
                                        round: true,
                                        languages: {
                                            shortEn: {
                                                y: "y",
                                                mo: "mo",
                                                w: "w",
                                                d: "d",
                                                h: "h",
                                                m: "m",
                                                s: "s",
                                                ms: "ms",
                                            }
                                        }
                                    }) + "/" + msg.member.voiceChannel.queue.songs[0].duration + ")",
                                    inline: true
                                },
                                {
                                    name: "Queue",
                                    value: ((queue.length > 0) ? queue.join("\n") : "Empty"),
                                    inline: true
                                }
                            ]
                        }
                    });
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