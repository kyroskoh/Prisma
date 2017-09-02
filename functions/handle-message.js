const handleDatabaseError = require("./handle-database-error.js");
const config = require("../config.json");
const util = require("util");

module.exports = (bot, database, msg) => {
    database.all("SELECT * FROM user_statistics WHERE userID = ?", [msg.author.id], (error, response) => {
        if (error) return handleDatabaseError(bot, error);
        if (response.length > 0) {
            database.run("UPDATE user_statistics SET messages = (messages + 1) WHERE userID = ?", [msg.author.id], (error) => {
                if (error) return handleDatabaseError(bot, error);
            });
        } else {
            database.run("INSERT INTO user_statistics (userID, messages, commands) VALUES (?, 1, 0)", [msg.author.id], (error) => {
                if (error) return handleDatabaseError(bot, error);
            });
        }
    });
    if (msg.guild) {
        database.all("SELECT * FROM server_statistics WHERE serverID = ?", [msg.guild.id], (error, response) => {
            if (error) return handleDatabaseError(bot, error);
            if (response.length > 0) {
                database.run("UPDATE server_statistics SET messages = (messages + 1) WHERE serverID = ?", [msg.guild.id], (error) => {
                    if (error) return handleDatabaseError(bot, error);
                });
            } else {
                database.run("INSERT INTO server_statistics (serverID, messages, commands) VALUES (?, 1, 0)", [msg.guild.id], (error) => {
                    if (error) return handleDatabaseError(bot, error);
                });
            }
        });
        database.all("SELECT * FROM channel_statistics WHERE channelID = ?", [msg.channel.id], (error, response) => {
            if (error) return handleDatabaseError(bot, error);
            if (response.length > 0) {
                database.run("UPDATE channel_statistics SET messages = (messages + 1) WHERE channelID = ?", [msg.channel.id], (error) => {
                    if (error) return handleDatabaseError(bot, error);
                });
            } else {
                database.run("INSERT INTO channel_statistics (channelID, messages, commands) VALUES (?, 1, 0)", [msg.channel.id], (error) => {
                    if (error) return handleDatabaseError(bot, error);
                });
            }
        });
    }
    if (msg.author.bot) return;
    if (!msg.content.startsWith(((msg.guild) ? msg.guild.data.prefix : config.prefix)) && !msg.content.startsWith("<@" + bot.user.id + "> ") && !msg.content.startsWith("<@!" + bot.user.id + "> ")) return;
    let prefix;
    if (msg.content.startsWith(((msg.guild) ? msg.guild.data.prefix : config.prefix))) prefix = ((msg.guild) ? msg.guild.data.prefix : config.prefix);
    if (msg.content.startsWith("<@" + bot.user.id + ">")) prefix = "<@" + bot.user.id + "> ";
    if (msg.content.startsWith("<@!" + bot.user.id + ">")) prefix = "<@!" + bot.user.id + "> ";
    let command = Object.keys(bot.commands).filter(c => bot.commands[c].commands.indexOf(msg.content.replace(prefix, "").split(" ")[0]) > -1);
    if (command.length > 0) {
        const args = ((msg.content.replace(prefix, "").split(" ").length > 1) ? msg.content.replace(prefix, "").split(" ").slice(1) : []);
        try {
            bot.commands[command[0]].execute(bot, database, msg, args);
        } catch (e) {
            msg.channel.send({
                embed: {
                    title: "Error!",
                    color: 0xE50000,
                    description: "An error occured when attempting to execute command."
                }
            });
            console.error("Failed to run '" + bot.commands[command[0]].commands[0] + "' command.", e);
        }
        database.all("SELECT * FROM command_usage WHERE command = ?", [command[0]], (error, response) => {
            if (error) return handleDatabaseError(bot, error);
            if (response.length > 0) {
                database.run("UPDATE command_usage SET usage = (usage + 1) WHERE command = ?", [command[0]], (error) => {
                    if (error) handleDatabaseError(bot, error);
                });
            } else {
                database.run("INSERT INTO command_usage (command, usage) VALUES (?, 1)", [command[0]], (error) => {
                    if (error) handleDatabaseError(bot, error);
                });
            }
        });
        database.all("SELECT * FROM user_statistics WHERE userID = ?", [msg.author.id], (error, response) => {
            if (error) return handleDatabaseError(bot, error);
            if (response.length > 0) {
                database.run("UPDATE user_statistics SET commands = (commands + 1) WHERE userID = ?", [msg.author.id], (error) => {
                    if (error) return handleDatabaseError(bot, error);
                });
            } else {
                database.run("INSERT INTO user_statistics (userID, messages, commands) VALUES (?, 1, 1)", [msg.author.id], (error) => {
                    if (error) return handleDatabaseError(bot, error);
                });
            }
        });
        if (msg.guild) {
            database.all("SELECT * FROM server_statistics WHERE serverID = ?", [msg.guild.id], (error, response) => {
                if (error) return handleDatabaseError(bot, error);
                if (response.length > 0) {
                    database.run("UPDATE server_statistics SET commands = (commands + 1) WHERE serverID = ?", [msg.guild.id], (error) => {
                        if (error) return handleDatabaseError(bot, error);
                    });
                } else {
                    database.run("INSERT INTO server_statistics (serverID, messages, commands) VALUES (?, 1, 1)", [msg.guild.id], (error) => {
                        if (error) return handleDatabaseError(bot, error);
                    });
                }
            });
            database.all("SELECT * FROM channel_statistics WHERE channelID = ?", [msg.channel.id], (error, response) => {
                if (error) return handleDatabaseError(bot, error);
                if (response.length > 0) {
                    database.run("UPDATE channel_statistics SET commands = (commands + 1) WHERE channelID = ?", [msg.channel.id], (error) => {
                        if (error) return handleDatabaseError(bot, error);
                    });
                } else {
                    database.run("INSERT INTO channel_statistics (channelID, messages, commands) VALUES (?, 1, 1)", [msg.channel.id], (error) => {
                        if (error) return handleDatabaseError(bot, error);
                    });
                }
            });
        }
    }
}