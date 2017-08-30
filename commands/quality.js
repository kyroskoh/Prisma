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
    usage: "quality [amount] [url | @user | username | userID]",
    category: "Image",
    hidden: false,
    execute: (bot, database, msg, args) => {
        return msg.channel.send({
            embed: {
                title: "Error!",
                color: 0xE50000,
                description: "The quality command currently does not work."
            }
        });
        if (args.length > 1) {
            if (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(args[1])) {
                next(args[1]);
            } else {
                resolveUser(bot, args.slice(1).join(" ")).then(user => {
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
                if (isNaN(Number(args[0]))) return msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "`" + args[1] + "` is not a valid number."
                    }
                });
                if (Number(args[0]) > 100) return msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "The quality amount cannot be greater than 100%."
                    }
                });
                if (Number(args[0]) < 1) return msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "The quality amount cannot be less than 1%."
                    }
                });
                amount = Number(args[0]);
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