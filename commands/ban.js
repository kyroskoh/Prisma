const snekfetch = require("snekfetch");

module.exports = {
    commands: [
        "ban",
        "banne"
    ],
    description: "Bans a user from the server.",
    usage: "ban [@user | user ID]",
    category: "Moderation",
    hidden: false,
    execute: (bot, database, msg, args) => {
        
    }
};