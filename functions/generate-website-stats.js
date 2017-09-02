const humanizeduration = require("humanize-duration");
const os = require("os");

module.exports = (bot, r) => {
    return new Promise((resolve, reject) => {
        r.table("user_statistics").sum("messages").run((error, messages_received) => {
            if (error) {
                reject(error);
            } else {
                resolve({
                    servers: bot.guilds.size,
                    users: bot.users.size,
                    channels: bot.channels.size,
                    text_channels: bot.channels.filter((c) => c.type === "text").size,
                    voice_channels: bot.channels.filter((c) => c.type === "voice").size,
                    roles: bot.guilds.map((s) => s.roles.size).reduce((a, b) => a + b, 0),
                    uptime: humanizeduration(Date.now() - bot.startuptime, {
                        round: true
                    }),
                    commands: Object.keys(bot.commands).length,
                    messages_received
                });
            }
        });
    });
};