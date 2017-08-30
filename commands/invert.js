const snekfetch = require("snekfetch");
const gm = require("gm");
const resolveUser = require("../functions/resolve-user.js");

module.exports = {
    commands: [
        "invert",
        "negative"
    ],
    description: "Inverts the colors of an image.",
    usage: "blur [url | @user | username | userID]",
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
            snekfetch.get(url).then(body => {
                try {
                    gm(body.body).negative().toBuffer((error, buffer) => {
                        if (error) return console.error("Failed to invert image.", error);
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