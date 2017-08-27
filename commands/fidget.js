const humanizeduration = require("humanize-duration");

module.exports = {
    commands: [
        "fidget"
    ],
    description: "Spin a fidget spinner.",
    usage: "fidget",
    category: "Fun",
    hidden: false,
    execute: (bot, database, msg, args) => {
        msg.channel.send({
            embed: {
                title: "Fidget Spinner",
                color: 3066993,
                description: "You spun a fidget spinner. Wait and see how long it spins for."
            }
        });
        var spin_time = Math.floor(Math.random() * (300000 - 30000)) + 30000;
        setTimeout(() => {
            msg.channel.send("<@" + msg.author.id + ">", {
                embed: {
                    title: "Fidget Spinner",
                    color: 3066993,
                    description: "Your fidget spinner spun for `" + humanizeduration(spin_time, {
                        round: true
                    }) + "."
                }
            });
        }, spin_time);
    }
};