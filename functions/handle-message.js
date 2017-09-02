const handleDatabaseError = require("./handle-database-error.js");
const config = require("../config.json");
const util = require("util");

module.exports = (bot, r, msg) => {
    /* r.table("user_statistics").filter({userID: msg.author.id}).run((error, response) => {
        if (error) return handleDatabaseError(bot, error);
        if (response.length > 0) {
            r.table("user_statistics").filter({userID: msg.author.id}).update({messages: response[0].messages + 1}).run((error) => {
                if (error) return handleDatabaseError(bot, error);
            });
        } else {
            r.table("user_statistics").insert({
                userID: msg.author.id,
                messages: 1,
                commands: 0
            }).run((error) => {
                if (error) return handleDatabaseError(bot, error);
            });
        }
    });
    if (msg.guild) {
        r.table("server_statistics").filter({serverID: msg.guild.id}).run((error, response) => {
            if (error) return handleDatabaseError(bot, error);
            if (response.length > 0) {
                r.table("server_statistics").filter({serverID: msg.guild.id}).update({messages: response[0].messages + 1}).run((error) => {
                    if (error) return handleDatabaseError(bot, error);
                });
            } else {
                r.table("server_statistics").insert({
                    serverID: msg.guild.id,
                    messages: 1,
                    commands: 0
                }).run((error) => {
                    if (error) return handleDatabaseError(bot, error);
                });
            }
        });
        r.table("channel_statistics").filter({channelID: msg.channel.id}).run((error, response) => {
            if (error) return handleDatabaseError(bot, error);
            if (response.length > 0) {
                r.table("channel_statistics").filter({channelID: msg.channel.id}).update({messages: response[0].messages + 1}).run((error) => {
                    if (error) return handleDatabaseError(bot, error);
                });
            } else {
                r.table("channel_statistics").insert({
                    channelID: msg.channel.id,
                    messages: 1,
                    commands: 0
                }).run((error) => {
                    if (error) return handleDatabaseError(bot, error);
                });
            }
        });
    } */
    if (msg.author.bot) return;
    if (!msg.content.startsWith(((msg.guild) ? msg.guild.data.prefix : config.prefix)) && !msg.content.startsWith("<@" + bot.user.id + "> ") && !msg.content.startsWith("<@!" + bot.user.id + "> ")) return;
    let prefix;
    if (msg.content.startsWith(((msg.guild) ? msg.guild.data.prefix : config.prefix))) prefix = ((msg.guild) ? msg.guild.data.prefix : config.prefix);
    if (msg.content.startsWith("<@" + bot.user.id + ">")) prefix = "<@" + bot.user.id + "> ";
    if (msg.content.startsWith("<@!" + bot.user.id + ">")) prefix = "<@!" + bot.user.id + "> ";
    let command = Object.keys(bot.commands).filter((c) => bot.commands[c].commands.indexOf(msg.content.replace(prefix, "").split(" ")[0]) > -1);
    if (command.length > 0) {
        const args = ((msg.content.replace(prefix, "").split(" ").length > 1) ? msg.content.replace(prefix, "").split(" ").slice(1) : []);
        try {
            bot.commands[command[0]].execute(bot, r, msg, args);
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
        /* r.table("user_statistics").filter({userID: msg.author.id}).run((error, response) => {
            if (error) return handleDatabaseError(bot, error);
            if (response.length > 0) {
                r.table("user_statistics").filter({userID: msg.author.id}).update({commands: response[0].commands + 1}).run((error) => {
                    if (error) return handleDatabaseError(bot, error);
                });
            } else {
                r.table("user_statistics").insert({
                    userID: msg.author.id,
                    messages: 1,
                    commands: 0
                }).run((error) => {
                    if (error) return handleDatabaseError(bot, error);
                });
            }
        });
        if (msg.guild) {
            r.table("server_statistics").filter({serverID: msg.guild.id}).run((error, response) => {
                if (error) return handleDatabaseError(bot, error);
                if (response.length > 0) {
                    r.table("server_statistics").filter({serverID: msg.guild.id}).update({commands: response[0].commands + 1}).run((error) => {
                        if (error) return handleDatabaseError(bot, error);
                    });
                } else {
                    r.table("server_statistics").insert({
                        serverID: msg.guild.id,
                        messages: 1,
                        commands: 1
                    }).run((error) => {
                        if (error) return handleDatabaseError(bot, error);
                    });
                }
            });
            r.table("channel_statistics").filter({channelID: msg.channel.id}).run((error, response) => {
                if (error) return handleDatabaseError(bot, error);
                if (response.length > 0) {
                    r.table("channel_statistics").filter({channelID: msg.channel.id}).update({commands: response[0].commands + 1}).run((error) => {
                        if (error) return handleDatabaseError(bot, error);
                    });
                } else {
                    r.table("channel_statistics").insert({
                        channelID: msg.channel.id,
                        messages: 1,
                        commands: 1
                    }).run((error) => {
                        if (error) return handleDatabaseError(bot, error);
                    });
                }
            });
        } */
    }
}