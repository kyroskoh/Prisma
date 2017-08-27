const handleDatabaseError = require("../functions/handle-database-error.js");
const resolveUser = require("../functions/resolve-user.js");

module.exports = {
    commands: [
        "userinfo",
        "user",
        "ui",
        "profile"
    ],
    description: "View specific information about a user.",
    usage: "userinfo [@user | user ID | username | username#discrim]",
    category: "Information",
    hidden: false,
    execute: (bot, database, msg, args) => {
        if (args.length > 0) {
            resolveUser(bot, args.join(" ")).then(user => {
                database.all("SELECT * FROM user_statistics WHERE userID = ?", [user.id], (error, response) => {
                    if (error) return handleDatabaseError(bot, error, msg);
                    var member = msg.guild.members.get(user.id);
                    if (member) {
                        if (member.voiceChannel) {
                            msg.channel.send({
                                embed: {
                                    title: "User Information",
                                    color: 3066993,
                                    thumbnail: {
                                        url: user.avatarURL
                                    },
                                    fields: [
                                        {
                                            name: "Username",
                                            value: user.tag,
                                            inline: true
                                        },
                                        {
                                            name: "ID",
                                            value: user.id,
                                            inline: true
                                        },
                                        {
                                            name: "Nickname",
                                            value: ((member.nickname) ? member.nickname : "None"),
                                            inline: true
                                        },
                                        {
                                            name: "Created At",
                                            value: new Date(user.createdAt).toUTCString(),
                                            inline: true
                                        },
                                        {
                                            name: "Joined At",
                                            value: new Date(member.joinedAt).toUTCString(),
                                            inline: true
                                        },
                                        {
                                            name: "Roles",
                                            value: (member.roles.size - 1),
                                            inline: true
                                        },
                                        {
                                            name: "Voice Channel",
                                            value: ((member.voiceChannel.type === "text") ? "#" + member.voiceChannel.name : member.voiceChannel.name),
                                            inline: true
                                        },
                                        {
                                            name: "Muted",
                                            value: ((member.serverMute) ? "Yes" : ((member.selfMute) ? "Yes" : "No")),
                                            inline: true
                                        },
                                        {
                                            name: "Deafened",
                                            value: ((member.serverDeaf) ? "Yes" : ((member.selfDeaf) ? "Yes" : "No")),
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
                        } else {
                            msg.channel.send({
                                embed: {
                                    title: "User Information",
                                    color: 3066993,
                                    thumbnail: {
                                        url: user.avatarURL
                                    },
                                    fields: [
                                        {
                                            name: "Username",
                                            value: user.tag,
                                            inline: true
                                        },
                                        {
                                            name: "ID",
                                            value: user.id,
                                            inline: true
                                        },
                                        {
                                            name: "Nickname",
                                            value: ((member.nickname) ? member.nickname : "None"),
                                            inline: true
                                        },
                                        {
                                            name: "Created At",
                                            value: new Date(user.createdAt).toUTCString(),
                                            inline: true
                                        },
                                        {
                                            name: "Joined At",
                                            value: new Date(member.joinedAt).toUTCString(),
                                            inline: true
                                        },
                                        {
                                            name: "Roles",
                                            value: (member.roles.size - 1),
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
                        }
                    } else {
                        msg.channel.send({
                            embed: {
                                title: "User Information",
                                color: 3066993,
                                thumbnail: {
                                    url: user.avatarURL
                                },
                                fields: [
                                    {
                                        name: "Username",
                                        value: user.tag,
                                        inline: true
                                    },
                                    {
                                        name: "ID",
                                        value: user.id,
                                        inline: true
                                    },
                                    {
                                        name: "Created At",
                                        value: new Date(user.createdAt).toUTCString(),
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
                    }
                });
            });
        } else {
            database.all("SELECT * FROM user_statistics WHERE userID = ?", [msg.author.id], (error, response) => {
                if (error) return handleDatabaseError(bot, error, msg);
                if (msg.member) {
                    if (msg.member.voiceChannel) {
                        msg.channel.send({
                            embed: {
                                title: "User Information",
                                color: 3066993,
                                thumbnail: {
                                    url: msg.author.avatarURL
                                },
                                fields: [
                                    {
                                        name: "Username",
                                        value: msg.author.tag,
                                        inline: true
                                    },
                                    {
                                        name: "ID",
                                        value: msg.author.id,
                                        inline: true
                                    },
                                    {
                                        name: "Nickname",
                                        value: ((msg.member.nickname) ? msg.member.nickname : "None"),
                                        inline: true
                                    },
                                    {
                                        name: "Created At",
                                        value: new Date(msg.author.createdAt).toUTCString(),
                                        inline: true
                                    },
                                    {
                                        name: "Joined At",
                                        value: new Date(msg.member.joinedAt).toUTCString(),
                                        inline: true
                                    },
                                    {
                                        name: "Roles",
                                        value: (msg.member.roles.size - 1),
                                        inline: true
                                    },
                                    {
                                        name: "Voice Channel",
                                        value: ((msg.member.voiceChannel.type === "text") ? "#" + msg.member.voiceChannel.name : msg.member.voiceChannel.name),
                                        inline: true
                                    },
                                    {
                                        name: "Muted",
                                        value: ((msg.member.serverMute) ? "Yes" : ((msg.member.selfMute) ? "Yes" : "No")),
                                        inline: true
                                    },
                                    {
                                        name: "Deafened",
                                        value: ((msg.member.serverDeaf) ? "Yes" : ((msg.member.selfDeaf) ? "Yes" : "No")),
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
                    } else {
                        msg.channel.send({
                            embed: {
                                title: "User Information",
                                color: 3066993,
                                thumbnail: {
                                    url: msg.author.avatarURL
                                },
                                fields: [
                                    {
                                        name: "Username",
                                        value: msg.author.tag,
                                        inline: true
                                    },
                                    {
                                        name: "ID",
                                        value: msg.author.id,
                                        inline: true
                                    },
                                    {
                                        name: "Nickname",
                                        value: ((msg.member.nickname) ? msg.member.nickname : "None"),
                                        inline: true
                                    },
                                    {
                                        name: "Created At",
                                        value: new Date(msg.author.createdAt).toUTCString(),
                                        inline: true
                                    },
                                    {
                                        name: "Joined At",
                                        value: new Date(msg.member.joinedAt).toUTCString(),
                                        inline: true
                                    },
                                    {
                                        name: "Roles",
                                        value: (msg.member.roles.size - 1),
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
                    }
                } else {
                    msg.channel.send({
                        embed: {
                            title: "User Information",
                            color: 3066993,
                            thumbnail: {
                                url: msg.author.avatarURL
                            },
                            fields: [
                                {
                                    name: "Username",
                                    value: msg.author.tag,
                                    inline: true
                                },
                                {
                                    name: "ID",
                                    value: msg.author.id,
                                    inline: true
                                },
                                {
                                    name: "Created At",
                                    value: new Date(msg.author.createdAt).toUTCString(),
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
                }
            });
        }
    }
};