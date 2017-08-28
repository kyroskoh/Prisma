const config = require("../config.json");
const handleDatabaseError = require("../functions/handle-database-error.js");
const resolveChannel = require("../functions/resolve-channel.js");

module.exports = {
    commands: [
        "settings",
        "setting",
        "config"
    ],
    description: "Change settins for this guild.",
    usage: "settings <\"set\" | \"unset\" | \"list\"> [setting name] [value]",
    category: "Moderation",
    hidden: false,
    execute: (bot, database, msg, args) => {
        if (msg.channel.type === "dm") return msg.channel.send({
            embed: {
                title: "Error!",
                color: 0xE50000,
                description: "This command cannot be used in a Direct Message."
            }
        });
        if (msg.member.hasPermission("MANAGE_CHANNELS") || config.trusted.indexOf(msg.author.id) > -1 || msg.author.id === msg.guild.ownerID) {
            if (args.length > 0) {
                if (args[0] === "set") {
                    if (args.length > 1) {
                        if (args[1] === "logs") {
                            if (args.length > 0) {
                                resolveUser(bot, args.slice(2).join(" ")).then(channel => {
                                    database.all("SELECT * FROM settings WHERE serverID = ? AND name = 'log_channel'", [msg.guild.id], (error, response) => {
                                        if (error) return handleDatabaseError(bot, error, msg);
                                        if (response.length > 0) {
                                            database.run("UPDATE settings SET value = ? WHERE name = 'log_channel' AND serverID = ?", [channel.id, msg.guild.id], (error) => {
                                                if (error) return handleDatabaseError(bot, error, msg);
                                                msg.channel.send({
                                                    embed: {
                                                        title: "Updated!",
                                                        color: 3066993,
                                                        description: "Successfully updated the log channel to <#" + channel.id + ">."
                                                    }
                                                });
                                            });
                                        } else {
                                            database.run("INSERT INTO settings (serverID, name, value) VALUES (?, 'log_channel', ?)", [msg.guild.id, channel.id], (error) => {
                                                if (error) return handleDatabaseError(bot, error, msg);
                                                msg.channel.send({
                                                    embed: {
                                                        title: "Updated!",
                                                        color: 3066993,
                                                        description: "Successfully updated the log channel to <#" + channel.id + ">."
                                                    }
                                                });
                                            });
                                        }
                                    });
                                }).catch(error => {
                                    msg.channel.send({
                                        embed: {
                                            title: "Error!",
                                            color: 0xE50000,
                                            description: "Unable to find any channels by that query."
                                        }
                                    });
                                });
                            } else {
                                database.all("SELECT * FROM settings WHERE serverID = ? AND name = 'log_channel'", [msg.guild.id], (error, response) => {
                                    if (error) return handleDatabaseError(bot, error, msg);
                                    if (response.length > 0) {
                                        database.run("UPDATE settings SET value = ? WHERE name = 'log_channel' AND serverID = ?", [msg.channel.id, msg.guild.id], (error) => {
                                            if (error) return handleDatabaseError(bot, error, msg);
                                            msg.channel.send({
                                                embed: {
                                                    title: "Updated!",
                                                    color: 3066993,
                                                    description: "Successfully updated the log channel to <#" + msg.channel.id + ">."
                                                }
                                            });
                                        });
                                    } else {
                                        database.run("INSERT INTO settings (serverID, name, value) VALUES (?, 'log_channel', ?)", [msg.guild.id, msg.channel.id], (error) => {
                                            if (error) return handleDatabaseError(bot, error, msg);
                                            msg.channel.send({
                                                embed: {
                                                    title: "Updated!",
                                                    color: 3066993,
                                                    description: "Successfully updated the log channel to <#" + msg.channel.id + ">."
                                                }
                                            });
                                        });
                                    }
                                });
                            }
                        } else {
                            msg.channel.send({
                                embed: {
                                    title: "Error!",
                                    color: 0xE50000,
                                    description: "Unknown setting name. Use `" + ((msg.guild) ? msg.guild.data.prefix : config.prefix) + "settings list` to view a list of settings."
                                }
                            });
                        }
                    } else {
                        msg.channel.send({
                            embed: {
                                title: "Error!",
                                color: 0xE50000,
                                description: "You need to supply an option to set. Use `" + ((msg.guild) ? msg.guild.data.prefix : config.prefix) + "settings list` to view a list of settings."
                            }
                        });
                    }
                } else if (args[0] === "unset") {
                    if (args.length > 1) {
                        if (args[1] === "logs") {
                            database.all("SELECT * FROM settings WHERE serverID = ? AND name = 'log_channel'", [msg.guild.id], (error, response) => {
                                if (error) return handleDatabaseError(bot, error, msg);
                                if (response.length > 0) {
                                    database.run("DELETE FROM settings WHERE serverID = ? AND name = 'log_channel'", [msg.guild.id], (error) => {
                                        if (error) return handleDatabaseError(bot, error, msg);
                                        msg.channel.send({
                                            embed: {
                                                title: "Updated!",
                                                color: 3066993,
                                                description: "Successfully unset the log channel."
                                            }
                                        });
                                    });
                                } else {
                                    msg.channel.send({
                                        embed: {
                                            title: "Error!",
                                            color: 0xE50000,
                                            description: "That setting is not set within this server."
                                        }
                                    });
                                }
                            });
                        } else {
                            msg.channel.send({
                                embed: {
                                    title: "Error!",
                                    color: 0xE50000,
                                    description: "Unknown setting name. Use `" + ((msg.guild) ? msg.guild.data.prefix : config.prefix) + "settings list` to view a list of settings."
                                }
                            });
                        }
                    } else {
                        msg.channel.send({
                            embed: {
                                title: "Error!",
                                color: 0xE50000,
                                description: "You must supply a setting to unset. Use `" + ((msg.guild) ? msg.guild.data.prefix : config.prefix) + "settings list` to view a list of settings."
                            }
                        });
                    }
                } else if (args[0] === "list") {
                    msg.channel.send({
                        embed: {
                            title: "Settings List",
                            color: 3066993,
                            description: "`logs` - The channel that server bans, kicks, etc are sent to."
                        }
                    });
                } else {
                    msg.channel.send({
                        embed: {
                            title: "Error!",
                            color: 0xE50000,
                            description: "`" + args[0] + "` is not a valid option."
                        }
                    });
                }
            } else {
                msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "Missing `<\"set\" | \"unset\" | \"list\">` option."
                    }
                });
            }
        } else {
            msg.channel.send({
                embed: {
                    title: "Error!",
                    color: 0xE50000,
                    description: "You do not have permission to execute this command. This command requires the `Manage Channels` permission."
                }
            });
        }
    }
};