const snekfetch = require("snekfetch");

module.exports = {
    commands: [
        "mcskin",
        "minecraftskin"
    ],
    description: "View the skin of a Minecraft player.",
    usage: "mcuser <username>",
    category: "Utility",
    hidden: false,
    execute: (bot, r, msg, args) => {
        if (args.length > 0) {
            snekfetch.get("http://www.minecraft-skin-viewer.net/3d.php?layers=true&aa=true&a=330&w=40&wt=0&abg=0&abd=0&ajg=0&ajd=0&ratio=13&format=png&login=" + encodeURIComponent(args.join(" ")) + "&headOnly=false&displayHairs=true&randomness=185").then((body) => {
                msg.channel.send({
                    files: [{
                        name: args.join(" ") + ".png",
                        attachment: body.body
                    }]
                }).catch((error) => {
                    msg.channel.send({
                        embed: {
                            title: "Error!",
                            color: 0xE50000,
                            description: "An unexpected error occured while attempting to get the skin of that user."
                        }
                    });
                    console.error("Failed to get information on a Minecraft skin.", error.message);
                });
            })
        } else {
            msg.channel.send({
                embed: {
                    title: "Error!",
                    color: 0xE50000,
                    description: "Missing `<username>` option."
                }
            });
        }
    }
};