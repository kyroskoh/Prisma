const handleDatabaseError = require("../functions/handle-database-error.js");
const resolveServer = require("../functions/resolve-server.js");

module.exports = {
    commands: [
        "serverinfo",
        "server",
        "si"
    ],
    description: "View specific information about a server.",
    usage: "serverinfo [server ID]",
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
            resolveServer(bot, args.join(" ")).then(guild => {
                database.all("SELECT * FROM server_statistics WHERE serverID = ?", [guild.id], (error, response) => {
                    if (error) return handleDatabaseError(bot, error, msg);
                    msg.channel.send({
                        embed: {
                            title: "Server Information",
                            color: 3066993,
                            thumbnail: {
                                url: guild.iconURL
                            },
                            fields: [
                                {
                                    name: "Name",
                                    value: guild.name,
                                    inline: true
                                },
                                {
                                    name: "ID",
                                    value: guild.id,
                                    inline: true
                                },
                                {
                                    name: "Owner",
                                    value: guild.owner.user.tag,
                                    inline: true
                                },
                                {
                                    name: "Owner ID",
                                    value: guild.owner.user.id,
                                    inline: true
                                },
                                {
                                    name: "Members",
                                    value: guild.memberCount,
                                    inline: true
                                },
                                {
                                    name: "Channels",
                                    value: guild.channels.size,
                                    inline: true
                                },
                                {
                                    name: "Roles",
                                    value: guild.roles.size,
                                    inline: true
                                },
                                {
                                    name: "Emojis",
                                    value: guild.emojis.size,
                                    inline: true
                                },
                                {
                                    name: "Region",
                                    value: guild.region,
                                    inline: true
                                },
                                {
                                    name: "Large (250+ members)",
                                    value: ((guild.large) ? "Yes" : "No"),
                                    inline: true
                                },
                                {
                                    name: "Verification Level",
                                    value: ((guild.verificationLevel === 0) ? "Low" : ((guild.verificationLevel === 1) ? "Medium" : ((guild.verificationLevel === 2) ? "(╯°□°）╯︵ ┻━┻" : ((guild.verificationLevel === 3) ? "┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻" : "Unknown")))),
                                    inline: true
                                },
                                {
                                    name: "Content Filter",
                                    value: ((guild.explicitContentFilter === 0) ? "Nothing" : ((guild.explicitContentFilter === 1) ? "Users without a role" : ((guild.explicitContentFilter === 2) ? "Eveything" : "Unknown"))),
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
            }).catch(error => {
                msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "Unable to find any servers by that query."
                    }
                });
            })
        } else {
            database.all("SELECT * FROM server_statistics WHERE serverID = ?", [msg.guild.id], (error, response) => {
                if (error) return handleDatabaseError(bot, error, msg);
                msg.channel.send({
                    embed: {
                        title: "Server Information",
                        color: 3066993,
                        thumbnail: {
                            url: msg.guild.iconURL
                        },
                        fields: [
                            {
                                name: "Name",
                                value: msg.guild.name,
                                inline: true
                            },
                            {
                                name: "ID",
                                value: msg.guild.id,
                                inline: true
                            },
                            {
                                name: "Owner",
                                value: msg.guild.owner.user.tag,
                                inline: true
                            },
                            {
                                name: "Owner ID",
                                value: msg.guild.owner.user.id,
                                inline: true
                            },
                            {
                                name: "Members",
                                value: msg.guild.memberCount,
                                inline: true
                            },
                            {
                                name: "Channels",
                                value: msg.guild.channels.size,
                                inline: true
                            },
                            {
                                name: "Roles",
                                value: msg.guild.roles.size,
                                inline: true
                            },
                            {
                                name: "Emojis",
                                value: msg.guild.emojis.size,
                                inline: true
                            },
                            {
                                name: "Region",
                                value: msg.guild.region,
                                inline: true
                            },
                            {
                                name: "Large (250+ members)",
                                value: ((msg.guild.large) ? "Yes" : "No"),
                                inline: true
                            },
                            {
                                name: "Verification Level",
                                value: ((msg.guild.verificationLevel === 0) ? "Low" : ((msg.guild.verificationLevel === 1) ? "Medium" : ((msg.guild.verificationLevel === 2) ? "(╯°□°）╯︵ ┻━┻" : ((msg.guild.verificationLevel === 3) ? "┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻" : "Unknown")))),
                                inline: true
                            },
                            {
                                name: "Content Filter",
                                value: ((msg.guild.explicitContentFilter === 0) ? "Nothing" : ((msg.guild.explicitContentFilter === 1) ? "Users without a role" : ((msg.guild.explicitContentFilter === 2) ? "Eveything" : "Unknown"))),
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