const porn = require("pornsearch");

module.exports = {
    commands: [
        "pornhub",
        "ph"
    ],
    usage: "pornhub <search query>",
    description: "Finds a video on PornHub.",
    category: "NSFW",
    hidden: false,
    execute: (bot, database, msg, args) => {
        if (!msg.channel.nsfw) return msg.channel.send({
            embed: {
                title: "Error!",
                color: 0xE50000,
                description: "This command can only be used in a NSFW channel."
            }
        });
        if (args.length > 0) {
            porn.search(args.join(" ")).videos().then(data => {
                msg.channel.send({
                    embed: {
                        title: "PornHub Video",
                        color: 3066993,
                        description: "[" + data["0"].title + "](" + data["0"].url + ")",
                        image: {
                            url: data["0"].thumb
                        }
                    }
                });
            }).catch(error => {
                msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "An unexpected error occured while searching for that video."
                    }
                });
                console.error(error);
            })
        } else {
            msg.channel.send({
                embed: {
                    title: "Error!",
                    color: 0xE50000,
                    description: "Missing `<search query>` option."
                }
            });
        }
    }
};