const snekfetch = require("snekfetch");

module.exports = {
    commands: [
        "bill",
        "belikebill"
    ],
    description: "Gives you a random Be Like Bill quote.",
    usage: "bill",
    category: "Image",
    hidden: false,
    execute: (bot, r, msg, args) => {
        snekfetch.get("http://belikebill.azurewebsites.net/billgen-API.php?default=1").then((body) => {
            msg.channel.send({
                files: [{
                    attachment: body.body,
                    name: "bill.jpg"
                }]
            });
        }).catch((error) => {
            msg.channel.send({
                embed: {
                    title: "Error!",
                    description: "An error occured while fetching a random bill image.",
                    color: 3066993
                }
            });
            console.error("Failed to generate a random bill.", error.message);
        });
    }
};