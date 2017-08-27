const updateBotLists = require("../functions/post-server-count.js");
const updatePresence = require("../functions/update-presence.js");

module.exports = (bot) => {
    bot.on("guildDelete", (server) => {
        updateBotLists(bot);
        updatePresence(bot);
    });
}