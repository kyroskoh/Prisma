const log = require("../managers/logger.js");
const util = require("util");
const humanizeduration = require("humanize-duration");
const express = require("express");
const generateWebsiteStats = require("../functions/generate-website-stats.js");
const https = require("https");
const fs = require("fs");
const steam = require("../functions/steam.js");
const updatePresence = require("../functions/update-presence.js");
const config = require("../config.json");

module.exports = (bot, database) => {
    bot.on("ready", () => {
        log(bot.user.username + " is ready! (" + (Date.now() - bot.startuptime) + "ms)");
        database.run("CREATE TABLE IF NOT EXISTS channel_statistics (channelID TEXT, messages BIGINT, commands BIGINT)");
        database.run("CREATE TABLE IF NOT EXISTS economy (userID TEXT, wallet BIGINT, bank BIGINT)");
        database.run("CREATE TABLE IF NOT EXISTS prefixes (serverID TEXT, prefix TEXT)");
        database.run("CREATE TABLE IF NOT EXISTS restart (time TEXT, channelID TEXT)");
        database.run("CREATE TABLE IF NOT EXISTS server_statistics (serverID TEXT, messages BIGINT, commands BIGINT)");
        database.run("CREATE TABLE IF NOT EXISTS settings (serverID TEXT, name TEXT, value TEXT)");
        database.run("CREATE TABLE IF NOT EXISTS statistics (name TEXT, value BIGINT)");
        database.run("CREATE TABLE IF NOT EXISTS steam_profiles (userID TEXT, id BIGINT)");
        database.run("CREATE TABLE IF NOT EXISTS stopwatch (userID TEXT, time BIGINT)");
        database.run("CREATE TABLE IF NOT EXISTS tags (serverID TEXT, name TEXT, value TEXT)");
        database.run("CREATE TABLE IF NOT EXISTS user_statistics (userID TEXT, messages BIGINT, commands BIGINT)");
        const startload = Date.now();
        process.on("unhandledRejection", error => {
            if (error.name === "DiscordAPIError") {
                if (error.code === 50013) return;
                if (error.code === 50001) return;
                if (error.code === 50007) return;
            }
            console.error(error);
        });
        process.on("uncaughtException", console.error);
        database.all("SELECT * FROM restart", (error, response) => {
            if (error) return handleDatabaseError(bot, error);
            if (response.length > 0) {
                if (bot.channels.get(response[0].channelID)) bot.channels.get(response[0].channelID).send({
                    embed: {
                        title: "Restarted!",
                        color: 3066993,
                        description: "Took `" + humanizeduration(Date.now() - response[0].time) + "`."
                    }
                });
                database.run("DELETE FROM restart", (error) => {
                    if (error) handleDatabaseError(bot, error);
                });
            }
        });
        database.all("SELECT * FROM restart", (error, response) => {
            if (error) return console.error(error);
            if (response.length > 0) {
                if (bot.channels.get(response[0].channelID)) bot.channels.get(response[0].channelID).send("Successfully restarted! Took `" + humanizeduration(Date.now() - response[0].time) + "`.");
                database.run("DELETE FROM restart", (error) => {
                    if (error) console.error(error);
                });
            }
        });
        if (bot.shard.id === 0) {
            const app = express();
            app.use((req, res, next) => {
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader("Access-Control-Allow-Methods", "GET");
                res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
                res.setHeader("Access-Control-Allow-Credentials", true);
                next();
            });
            app.get("/stats", (req, res) => {
                generateWebsiteStats(bot, database).then(r => res.send(r)).catch(error => {
                    console.error(error);
                    res.send({
                        error
                    });
                });
            });
            app.get("/commands", (req, res) => {
                let commands = Object.keys(bot.commands).filter(c => !bot.commands[c].hidden);
                let categorized = {};
                commands.map(c => {
                    if (!(bot.commands[c].category in categorized)) categorized[bot.commands[c].category] = [];
                    categorized[bot.commands[c].category].push({
                        usage: bot.commands[c].usage,
                        command: bot.commands[c].commands[0],
                        aliases: bot.commands[c].commands.slice(1),
                        description: bot.commands[c].description
                    });
                });
                res.send(categorized);
            });
            app.listen(83, (error) => {
                if (error) throw new error;
                log("Express server listening on port 83.");
            });
        }
        steam();
        bot.guilds.map(g => {
            g.data = {};
            g.data.prefix = config.prefix;
        });
        database.all("SELECT * FROM prefixes", (error, response) => {
            if (error) return handleDatabaseError(bot, error);
            response.map(v => {
                if (bot.guilds.get(v.serverID)) bot.guilds.get(v.serverID).data.prefix = v.prefix;
            });
        });
        updatePresence(bot);
    });
};