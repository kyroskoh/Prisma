const resolveUser = require("../functions/resolve-user.js");

module.exports = {
    commands: [
        "ban",
        "banne"
    ],
    description: "Bans a user from the server.",
    usage: "ban [@user | user ID]",
    category: "Moderation",
    hidden: false,
    execute: (bot, r, msg, args) => {
        if (msg.channel.type === "dm") return msg.channel.send({
            embed: {
                title: "Error!",
                color: 0xE50000,
                description: "This command cannot be used in a Direct Message."
            }
        });
        if (msg.member.hasPermission("BAN_MEMBERS")) {
            if (msg.guild.me.hasPermission("BAN_MEMBERS")) {
                // todo
            } else {
                msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "I do not have permission to ban members. Please give me the `Ban Members` command."
                    }
                });
            }
        } else {
            msg.channel.send({
                embed: {
                    title: "Error!",
                    color: 0xE50000,
                    description: "You do not have permission to use this command. This command requires the `Ban Members` permission."
                }
            });
        }
    }
};