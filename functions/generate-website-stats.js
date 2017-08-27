const humanizeduration = require("humanize-duration");
const os = require("os");

module.exports = (bot, database) => {
    return new Promise((resolve, reject) => {
        database.all("SELECT sum(messages) AS messages_received FROM user_statistics", (error, messages_received) => {
            if (error) {
                reject(error);
            } else {
                database.all("SELECT sum(value) AS commands FROM statistics WHERE name LIKE 'command_%'", (error, commands) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve({
                            servers: bot.guilds.size,
                            users: bot.users.size,
                            channels: bot.channels.size,
                            text_channels: bot.channels.filter(c => c.type === "text").size,
                            voice_channels: bot.channels.filter(c => c.type === "voice").size,
                            roles: bot.guilds.map(s => s.roles.size).reduce((a, b) => a + b, 0),
                            uptime: humanizeduration(Date.now() - bot.startuptime, {
                                round: true
                            }),
                            commands: Object.keys(bot.commands).length,
                            messages_received: messages_received[0].messages_received,
                            commands_received: commands[0].commands
                        });
                    }
                });
            }
        });
    });
};