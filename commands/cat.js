const snekfetch = require("snekfetch");
const config = require("../config.json");

module.exports = {
    commands: [
        "cat",
        "randomcat"
    ],
    description: "Get a random picture of a cat.",
    usage: "cat",
    category: "Fun",
    hidden: false,
    execute: (bot, database, msg, args) => {
        msg.channel.send({
            embed: {
                title: "Uploading...",
                color: 3066993,
                description: "If the bot fails to upload the image in the next couple seconds, please try the command again."
            }
        }).then(m => {
            snekfetch.get("http://thecatapi.com/api/images/get").send({
                api_key: config.api_keys.thecatapi,
                format: "src",
                type: "jpg,png",
            }).then(body => {
                msg.channel.send({
                    files: [
                        {
                            attachment: body.body,
                            name: "cat.png"
                        }
                    ]
                }).then(() => m.delete());
            }).catch(error => {
                m.edit({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "An unexpected error occured while trying to fetch a random cat."
                    }
                });
                console.error("Failed to get a random cat picture.", error.message);
            });
        });
    }
};