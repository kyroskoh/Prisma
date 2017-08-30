const snekfetch = require("snekfetch");
const gm = require("gm");
const resolveUser = require("../functions/resolve-user.js");

module.exports = {
    commands: [
        "rotate"
    ],
    description: "Rotates an image a certain degrees.",
    usage: "rotate <degrees> [url | @user | username | userID]",
    category: "Image",
    hidden: false,
    execute: (bot, database, msg, args) => {
        if (args.length > 0) {
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
        } else {
            msg.channel.send({
                embed: {
                    title: "Error!",
                    color: 0xE50000,
                    description: "Missing `<degrees>` option."
                }
            });
        }
        function next(url) {
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
                    description: "The blur amount cannot be greater than 100%."
                }
            });
            if (Number(args[0]) < 1) return msg.channel.send({
                embed: {
                    title: "Error!",
                    color: 0xE50000,
                    description: "The blur amount cannot be less than 1%."
                }
            });
            const amount = Number(args[0]);
            snekfetch.get(url).then(body => {
                try {
                    gm(body.body).rotate("#000", amount).toBuffer((error, buffer) => {
                        if (error) return console.error("Failed to rotate image.", error);
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