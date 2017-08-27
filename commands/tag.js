const handleDatabaseError = require("../functions/handle-database-error.js");
const prefix = require("../config.json");

module.exports = {
    commands: [
        "tag",
        "tags"
    ],
    description: "Add, remove or view server-only tags.",
    usage: "tag <\"add\" | \"list\" | \"edit\" | \"remove\"> <tag name> [new value]",
    category: "Utility",
    hidden: false,
    execute: (bot, database, msg, args) => {
        if (msg.channel.type === "dm") return msg.channel.send({
            embed: {
                title: "Error!",
                color: 0xE50000,
                description: "You cannot use this command in a Direct Message."
            }
        });
        if (args.length > 0) {
            if (args[0] === "add") {
                if (args.length > 1) {
                    if (args.length > 2) {
                        database.all("SELECT * FROM tags WHERE serverID = ? AND name = ?", [msg.guild.id, args[2]], (error, response) => {
                            if (error) return handleDatabaseError(bot, error, msg);
                            if (response.length > 0) {
                                msg.channel.send({
                                    embed: {
                                        title: "Error!",
                                        color: 0xE50000,
                                        description: "There is already a tag by that name."
                                    }
                                });
                            } else {
                                database.run("INSERT INTO tags (serverID, name, value) VALUES (?, ?, ?)", [msg.guild.id, args[1], args.slice(2).join(" ")], (error) => {
                                    if (error) return handleDatabaseError(bot, error, msg);
                                    msg.channel.send({
                                        embed: {
                                            title: "Added!",
                                            color: 3066993,
                                            description: "Successfully added tag `" + args[1] + "`."
                                        }
                                    });
                                });
                            }
                        });
                    } else {
                        msg.channel.send({
                            embed: {
                                title: "Error!",
                                color: 0xE50000,
                                description: "Missing `[new value]` option."
                            }
                        });
                    }
                } else {
                    msg.channel.send({
                        embed: {
                            title: "Error!",
                            color: 0xE50000,
                            description: "Missing `<tag name>` option."
                        }
                    });
                }
            } else if (args[0] === "list") {
                database.all("SELECT * FROM tags WHERE serverID = ?", [msg.guild.id], (error, response) => {
                    if (error) return handleDatabaseError(bot, error, msg);
                    if (response.length > 0) {
                        msg.channel.send({
                            embed: {
                                title: "Tags",
                                color: 3066993,
                                description: response.map(t => "› " + t.name).join("\n")
                            }
                        });
                    } else {
                        msg.channel.send({
                            embed: {
                                title: "Error!",
                                color: 0xE50000,
                                description: "There are no tags for this server."
                            }
                        });
                    }
                });
            } else if (args[0] === "edit") {
                if (args.length > 1) {
                    if (args.length > 2) {
                        database.all("SELECT * FROM tags WHERE serverID = ? AND name = ?", [msg.guild.id, args[1]], (error, response) => {
                            if (error) return handleDatabaseError(bot, error, msg);
                            if (response.length > 0) {
                                database.run("UPDATE tags SET value = ? WHERE serverID = ? AND name = ?", [args.slice(2).join(" "), msg.guild.id, args[1]], (error) => {
                                    if (error) return handleDatabaseError(bot, error, msg);
                                    msg.channel.send({
                                        embed: {
                                            title: "Updated!",
                                            color: 3066993,
                                            description: "Successfully updated tag `" + args[1] + "`."
                                        }
                                    });
                                });
                            } else {
                                msg.channel.send({
                                    embed: {
                                        title: "Error!",
                                        color: 0xE50000,
                                        description: "That is not a tag that I know of."
                                    }
                                });
                            }
                        });
                    } else {
                        msg.channel.send({
                            embed: {
                                title: "Error!",
                                color: 0xE50000,
                                description: "Missing `[new value]` option."
                            }
                        });
                    }
                } else {
                    msg.channel.send({
                        embed: {
                            title: "Error!",
                            color: 0xE50000,
                            description: "Missing `<tag name>` option."
                        }
                    });
                }
            } else if (args[0] === "remove") {
                if (args.length > 1) {
                    database.all("SELECT * FROM tags WHERE name = ? AND serverID = ?", [args[1], msg.guild.id], (error, response) => {
                        if (error) return handleDatabaseError(bot, error, msg);
                        if (response.length > 0) {
                            database.run("DELETE FROM tags WHERE serverID = ? AND name = ?", [msg.guild.id, args[1]], (error) => {
                                if (error) return handleDatabaseError(bot, error, msg);
                                msg.channel.send({
                                    embed: {
                                        title: "Deleted!",
                                        color: 3066993,
                                        description: "Successfully deleted tag `" + args[1] + "`."
                                    }
                                });
                            });
                        } else {
                            msg.channel.send({
                                embed: {
                                    title: "Error!",
                                    color: 0xE50000,
                                    description: "That is not a tag that I know of."
                                }
                            });
                        }
                    });
                } else {
                    msg.channel.send({
                        embed: {
                            title: "Error!",
                            color: 0xE50000,
                            description: "Missing `<tag name>` option."
                        }
                    });
                }
            } else {
                database.all("SELECT * FROM tags WHERE serverID = ? AND name = ?", [msg.guild.id, args[0]], (error, response) => {
                    if (error) return handleDatabaseError(bot, error, msg);
                    if (response.length > 0) {
                        msg.channel.send(response[0].value);
                    } else {
                        msg.channel.send({
                            embed: {
                                title: "Error!",
                                color: 0xE50000,
                                description: "That is not a tag that I know of. Use `" + ((msg.guild) ? msg.guild.data.prefix : config.prefix) + "tag list` to view a list of tags."
                            }
                        });
                    }
                });
            }
        } else {
            msg.channel.send({
                embed: {
                    title: "Error!",
                    color: 0xE50000,
                    description: "Missing `<\"add\" | \"list\" | \"edit\" | \"remove\">` option."
                }
            });
        }
    }
};