const config = require("../config.json");

module.exports = {
    commands: [
        "prune",
        "purge"
    ],
    description: "Delete a certain amount of messages.",
    category: "Moderation",
    usage: "prune [@user | user ID | username | \"bots\"] <amount>",
    hidden: false,
    execute: (bot, database, msg, args) => {
        if (msg.channel.type === "dm") return msg.channel.send({
            embed: {
                title: "Error!",
                color: 0xE50000,
                description: "This command cannot be used in a Direct Message"
            }
        });
        if (msg.member.hasPermission("MANAGE_MESSAGES") || msg.author.id === msg.guild.ownerID || config.trusted.indexOf(msg.author.id) > -1) {
            if (msg.guild.me.hasPermission("MANAGE_MESSAGES")) {
                if (isNaN(args[0] || 100)) {
                    msg.channel.send({
                        embed: {
                            title: "Error!",
                            color: 0xE50000,
                            description: "`" + args[0] + "` isn't a valid prune amount."
                        }
                    });
                } else {
                    if (Number(args[0] || 100) > 100) return msg.channel.send({
                        embed: {
                            title: "Error!",
                            color: 0xE50000,
                            description: "You cannot prune more than 100 messages at once."
                        }
                    });
                    const amount = Number(args[0] || 100);
                    msg.channel.fetchMessages({
                        limit: Math.min(amount, 100),
                        before: msg.id
                    }).then(messages => {
                        if (messages.size < 1) return msg.channel.send({
                            embed: {
                                title: "Error!",
                                color: 0xE50000,
                                description: "There are no messages to delete."
                            }
                        });
                        msg.channel.bulkDelete(messages).then(() => {
                            msg.channel.send({
                                embed: {
                                    title: "Pruned!",
                                    color: 3066993,
                                    description: "Deleted `" + messages.size + "` messages from <#" + msg.channel.id + ">."
                                }
                            }).then(newmsg => {
                                newmsg.delete(3500);
                                msg.delete(3500);
                            });
                        }).catch(error => {
                            if (error.message === "You can only bulk delete messages that are under 14 days old.") return msg.channel.send({
                                embed: {
                                    title: "Error!",
                                    color: 0xE50000,
                                    description: "Due to API restrictions, I am unable to delete messages over 14 days old."
                                }
                            });
                            msg.channel.send({
                                embed: {
                                    title: "Error!",
                                    color: 0xE50000,
                                    description: "An unexpected error occured while trying to delete messages."
                                }
                            });
                            console.error("Failed to delete prune messages.", error.message);
                        });
                    }).catch(error => {
                        msg.channel.send({
                            embed: {
                                title: "Error!",
                                color: 0xE50000,
                                description: "An unexpected error occured while fetching messages."
                            }
                        });
                        console.error("Failed to fetch prune messages.", error.message);
                    });
                }
            } else {
                msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "I do not have permission to delete messages. This requires for me to have the `Manage Messages` permission."
                    }
                });
            }
        } else {
            msg.channel.send({
                embed: {
                    title: "Error!",
                    color: 0xE50000,
                    description: "You do not have permission to execute this command. This requires the `Manage Messages` permission."
                }
            });
        }
    }
};