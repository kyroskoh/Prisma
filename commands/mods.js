const aids = require("aids");

module.exports = {
    commands: [
        "mods",
        "moderators",
        "admins",
        "administrators"
    ],
    description: "Get a list of online & offline moderators.",
    usage: " <text>",
    category: "Fun",
    hidden: false,
    execute: (bot, r, msg, args) => {
        if (msg.channel.type === "dm") return msg.channel.send({
            embed: {
                title: "Error!",
                color: 0xE50000,
                description: "This command cannot be used in a Direct Message."
            }
        });
        const mods = msg.guild.roles.filter(r => r.name.toLowerCase() === "mods" || r.name.toLowerCase() === "moderators" || r.name.toLowerCase() === "moderator" || r.name.toLowerCase() === "mod" || r.name.toLowerCase() === "admins" || r.name.toLowerCase() === "administrators" || r.name.toLowerCase() === "admin" || r.name.toLowerCase() === "administrator");
        if (mods.size > 0) {
            const allMods = [].concat.apply([], mods.map(r => r.members.filter(u => !u.user.bot).map(u => {
                return {
                    tag: u.user.tag,
                    status: u.presence.status
                };
            })));
            if (allMods.length < 1) {
                msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 3066993,
                        description: "There are no users within the staff roles."
                    }
                });
            } else {
                console.log(allMods);
                const sorted = {};
                allMods.map(m => {
                    if (!(m.status in sorted)) sorted[m.status] = [];
                    sorted[m.status].push(m.tag);
                });
                const keys = Object.keys(sorted);
                keys.sort((a, b) => {
                    if (a.status === "online") return -1;
                    if (a.status === "idle") return 0;
                    if (a.status === "dnd") return 1;
                    if (a.status === "offline") return 2;
                });
                msg.channel.send({
                    embed: {
                        title: "Moderators",
                        color: 3066993,
                        description: keys.map(k => ((k === "online") ? "<:online:313956277808005120>" : ((k === "idle") ? "<:away:313956277220802560>" : ((k === "dnd") ? "<:dnd:313956276893646850>" : ((k === "offline") ? "<:offline:313956277237710868>" : "unknown")))) + " " + sorted[k].join(", ")).join("\n\n")
                    }
                });
            }
        } else {

        }
    }
};