module.exports = {
    commands: [
        "raffle"
    ],
    description: "Pick a random user from the server's member list.",
    usage: "raffle",
    category: "Random",
    hidden: false,
    execute: (bot, database, msg, args) => {
        if (msg.channel.type === "dm") return msg.channel.send({
            embed: {
                title: "Error!",
                color: 0xE50000,
                description: "This command cannot be used in a Direct Message."
            }
        });
        const user = msg.guild.members.filter(u => !u.user.bot).random();
        msg.channel.send({
            embed: {
                title: "Random User",
                color: 3066993,
                description: (user.nickname) ? "<@!" + user.user.id + ">" : "<@" + user.user.id + ">"
            }
        });
    }
};