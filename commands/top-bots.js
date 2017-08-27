const allbots = require("../data/bots.json").filter(b => b.servercount !== "0");

module.exports = {
    commands: [
        "topbots",
        "bots"
    ],
    description: "View the top bots by server count.",
    usage: "topbots",
    category: "Utility",
    hidden: false,
    execute: (bot, database, msg, args) => {
        var page = 1;
        if (args.length > 0) {
            if (isNaN(args[0])) return msg.channel.send({
                embed: {
                    title: "Error!",
                    color: 0xE50000,
                    description: "`" + args[0] + "` is not a valid number."
                }
            });
            if (Number(args[0]) < 1) return msg.channel.send({
                embed: {
                    title: "Error!",
                    color: 0xE50000,
                    description: "The page number must be greater than zero."
                }
            });
            if (Number(args[0]) > Math.ceil(allbots.length / 10)) return msg.channel.send({
                embed: {
                    title: "Error!",
                    color: 0xE50000,
                    description: "Page `" + args[0] + "` does not exist."
                }
            });
            page = Number(args[0]);
        }
        allbots.sort((a, b) => b.servercount - a.servercount);
        var bots = allbots.slice((page * 10) - 10, page * 10);
        msg.channel.send({
            embed: {
                title: "Top Bots",
                color: 3066993,
                fields: bots.map(b => {
                    return {
                        name: b.name,
                        value: "**Servers**: " + b.servercount,
                        inline: true
                    };
                }),
                footer: {
                    text: "Page " + page + " / " + Math.ceil(allbots.length / 10)
                }
            }
        });
    }
};