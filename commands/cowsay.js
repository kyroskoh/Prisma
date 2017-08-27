const snekfetch = require("snekfetch");

module.exports = {
    commands: [
        "cowsay"
    ],
    description: "Moo.",
    usage: "cowsay <text>",
    category: "Fun",
    hidden: false,
    execute: (bot, database, msg, args) => {
        if (args.length > 0) {
            snekfetch.get("http://cowsay.morecode.org/say?message=" + encodeURIComponent(args.join(" ")) + "&format=json").then(body => {
                msg.channel.send("```\n" + body.body.cow + "```");
            }).catch(error => {
                msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "An unexpected error occured while generated cow."
                    }
                });
                console.error("Failed to generate cowsay.", error.message);
            });
        } else {
            msg.channel.send({
                embed: {
                    title: "Error!",
                    color: 0xE50000,
                    description: "Missing `<text>` option."
                }
            });
        }
    }
};