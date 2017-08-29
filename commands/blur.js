const snekfetch = require("snekfetch");
const gm = require("gm");
const resolveUser = require("../functions/resolve-user.js");

module.exports = {
    commands: [
        "blur"
    ],
    description: "Blurs an image a certain percent.",
    usage: "blur [url | @user | username | userID] [amount]",
    category: "Image",
    hidden: false,
    execute: (bot, database, msg, args) => {
        if (args.length > 0) {
            if (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(args[0])) {
                next(args[0]);
            } else {
                resolveUser(bot, args[0]).then(user => {
                    next(user.avatarURL);
                }).catch(error => {
                    msg.channel.send({
                        embed: {
                            title: "Error!",
                            color: 0xE50000,
                            description: "Unable to find any users by that search."
                        }
                    });
                });
            }
        } else {
            next(msg.author.avatarURL);
        }
        function next(url) {
            let amount = 15;
            if (args.length > 1) {
                if (isNaN(Number(args[1].replace("%", "")))) return msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "`" + args[1] + "` is not a valid number."
                    }
                });
                if (Number(args[1].replace("%", "")) > 100) return msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "The blur amount cannot be greater than 100%."
                    }
                });
                if (Number(args[1].replace("%", "")) < 1) return msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "The blur amount cannot be less than 1%."
                    }
                });
                amount = Number(args[1].replace("%", ""));
            }
            snekfetch.get(url).then(body => {
                try {
                    gm(body.body).blur(25, amount).toBuffer((error, buffer) => {
                        if (error) return console.error(error);
                        msg.channel.send({
                            files: [
                                {
                                    attachment: buffer,
                                    name: "image.png"
                                }
                            ]
                        });
                    });
                } catch (e) {
                    msg.channel.send({
                        embed: {
                            title: "Error!",
                            color: 0xE50000,
                            description: "An error occured while editing image."
                        }
                    });
                }
            }).catch(error => {
                msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "Failed to load image. `" + error.message + "`"
                    }
                });
            });
        }
    }
};