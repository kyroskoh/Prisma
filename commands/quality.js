const snekfetch = require("snekfetch");
const gm = require("gm");
const resolveUser = require("../functions/resolve-user.js");

module.exports = {
    commands: [
        "quality",
        "jpeg",
        "jpf"
    ],
    description: "Changed the quality of an image.",
    usage: "quality [url | @user | username | userID] [amount]",
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
            let amount = 25;
            if (args.length > 1) {
                if (isNaN(Number(args[1]))) return msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "`" + args[1] + "` is not a valid number."
                    }
                });
                if (Number(args[1]) > 100) return msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "The quality amount cannot be greater than 100%."
                    }
                });
                if (Number(args[1]) < 1) return msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "The quality amount cannot be less than 1%."
                    }
                });
                amount = Number(args[1]);
            }
            snekfetch.get(url).then(body => {
                try {
                    gm(body.body).compress("jpeg").quality(amount).toBuffer((error, buffer) => {
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