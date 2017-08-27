const handleDatabaseError = require("../functions/handle-database-error.js");

module.exports = (bot, database) => {
    bot.on("guildBanAdd", (guild, user) => {
        database.all("SELECT * FROM settings WHERE serverID = ? AND name = 'log_channel'", [guild.id], (error, response) => {
            if (error) return handleDatabaseError(bot, error);
            if (response.length > 0) {
                if (bot.channels.get(response[0].value)) bot.channels.get(response[0].value).send({
                    embed: {
                        title: "Member Banned",
                        color: 15880993,
                        fields: [{
                                name: "Username",
                                value: user.tag,
                                inline: false
                            },
                            {
                                name: "Timestamp",
                                value: new Date().toUTCString(),
                                inline: false
                            }
                        ]
                    }
                });
            }
        })
    });
}