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
    execute: (bot, database, msg, args) => {
        if (msg.channel.type === "dm") return msg.channel.send({
            embed: {
                title: "Error!",
                color: 0xE50000,
                description: "This command cannot be used in a Direct Message."
            }
        });
        if (args.length > 0) {
            resolveChannel(bot, args.join(" ")).then(channel => {
                database.all("SELECT * FROM channel_statistics WHERE channelID = ?", [channel.id], (error, response) => {
                    if (error) return handleDatabaseError(bot, error, msg);
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
                                },
                                {
                                    name: "Messages",
                                    value: ((response.length > 0) ? response[0].messages : "0"),
                                    inline: true
                                },
                                {
                                    name: "Commands",
                                    value: ((response.length > 0) ? response[0].commands : "0"),
                                    inline: true
                                }
                            ]
                        }
                    });
                });
            }).catch(e => {
                msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "Unable to find any channels by that query."
                    }
                });
            });
        } else {
            database.all("SELECT * FROM channel_statistics WHERE channelID = ?", [msg.channel.id], (error, response) => {
                if (error) return handleDatabaseError(bot, error, msg);
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
                            },
                            {
                                name: "Messages",
                                value: ((response.length > 0) ? response[0].messages : "0"),
                                inline: true
                            },
                            {
                                name: "Commands",
                                value: ((response.length > 0) ? response[0].commands : "0"),
                                inline: true
                            }
                        ]
                    }
                });
            });
        }
    }
};