const config = require("./config.json");
const log = require("./managers/logger.js");
const fs = require("fs");
const Discord = require("discord.js");
const rethink = require("rethinkdbdash");

let bot = new Discord.Client();

const r = rethink(config.rethink);

bot.commands = [];
bot.startuptime = Date.now();

let startload = Date.now();

fs.readdir("./commands", (error, files) => {
    if (error) throw new error;
    files.forEach((index) => {
        bot.commands[index.replace(/\..*/g, "")] = require("./commands/" + index);
        if (files.indexOf(index) === (files.length - 1)) {
            log("Loaded " + files.length + " command" + ((files.length === 1) ? "" : "s") + "! (" + (Date.now() - startload) + "ms)");
            startload = Date.now();
            fs.readdir("./events", function(error, files) {
                if (error) throw new error;
                files.forEach((index) => {
                    require("./events/" + index)(bot, r);
                    if (files.indexOf(index) === (files.length - 1)) {
                        log("Loaded " + files.length + " event" + ((files.length === 1) ? "" : "s") + "! (" + (Date.now() - startload) + "ms)");
                        startload = Date.now();
                        fs.readdir("./schedules", function(error, files) {
                            if (error) throw new error;
                            files.forEach((index) => {
                                setInterval(require("./schedules/" + index).execute, require("./schedules/" + index).interval, bot, r);
                                if (files.indexOf(index) === (files.length - 1)) {
                                    log("Loaded " + files.length + " schedule" + ((files.length === 1) ? "" : "s") + "! (" + (Date.now() - startload) + "ms)");
                                    bot.login(config.token);
                                }
                            });
                        });
                    }
                });
            });
        }
    });
});