const util = require("util");
const humanizeduration = require("humanize-duration");

module.exports = {
    commands: [
        "statistics",
        "stats"
    ],
    description: "View statistical information about the bot.",
    usage: "stats",
    category: "Information",
    hidden: false,
    execute: (bot, database, msg, args) => {
        bot.shard.broadcastEval("[this.guilds.size, this.users.size, this.voiceConnections.size, (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)]").then(data => {
            let newdata = [0, 0, 0, 0];
            data.forEach(v => {
                v.forEach(nv => {
                    newdata[v.indexOf(nv)] += Number(nv);
                });
            });
            msg.channel.send({
                embed: {
                    title: "Bot Statistics",
                    color: 3066993,
                    fields: [
                        {
                            name: "Servers",
                            value: newdata[0].toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,"),
                            inline: true
                        },
                        {
                            name: "Users",
                            value: newdata[1].toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,"),
                            inline: true
                        },
                        {
                            name: "Voice Connections",
                            value: newdata[2].toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,"),
                            inline: true
                        },
                        {
                            name: "Memory Usage",
                            value: newdata[3] + " MB",
                            inline: true
                        },
                        {
                            name: "Commands",
                            value: Object.keys(bot.commands).length.toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,"),
                            inline: true
                        },
                        {
                            name: "Uptime",
                            value: humanizeduration(Date.now() - bot.startuptime, {
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
                            }),
                            inline: true
                        }
                    ]
                }
            });
        }).catch(error => {
            msg.channel.send({
                embed: {
                    title: "Error!",
                    color: 0xE50000,
                    description: "An error occured while generating stats."
                }
            });
            console.error(error);
        });
    }
};