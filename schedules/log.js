const handleDatabaseError = require("../functions/handle-database-error.js");

module.exports = {
    interval: 1000 * 60 * 60 * 2,
    execute: (bot, database) => {
        database.all("SELECT sum(messages) AS messages_received FROM user_statistics", (error, messages_received) => {
            if (error) {
                handleDatabaseError(bot, error);
                reject(error);
            } else {
                bot.shard.fetchClientValues("guilds.size").then(guilds => {
                    bot.shard.fetchClientValues("users.size").then(users => {
                        bot.shard.fetchClientValues("channels.size").then(channels => {
                            bot.shard.broadcastEval("this.channels.filter(c => c.type === 'text').size").then(text_channels => {
                                bot.shard.broadcastEval("this.channels.filter(c => c.type === 'voice').size").then(voice_channels => {
                                    bot.shard.broadcastEval("this.guilds.map(g => g.roles.size).reduce((a, b) => a + b, 0)").then(roles => {
                                        database.run("INSERT INTO logs (timestamp, servers, users, channels, text_channels, voice_channels, roles, messages_received) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
                                            Date.now(),
                                            guilds.reduce((a, b) => a + b, 0),
                                            users.reduce((a, b) => a + b, 0),
                                            channels.reduce((a, b) => a + b, 0),
                                            text_channels.reduce((a, b) => a + b, 0),
                                            voice_channels.reduce((a, b) => a + b, 0),
                                            roles.reduce((a, b) => a + b, 0),
                                            messages_received[0].messages_received
                                        ], (error) => {
                                            if (error) console.error(error);
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            }
        });
    }
};