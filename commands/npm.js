const snekfetch = require("snekfetch");
const humanizeduration = require("humanize-duration");

module.exports = {
    commands: [
        "npm",
        "package"
    ],
    description: "View information about an npm package.",
    usage: "npm <name>",
    category: "Information",
    hidden: false,
    execute: (bot, r, msg, args) => {
        if (args.length > 0) {
            snekfetch.get("https://skimdb.npmjs.com/registry/" + args[0].toLowerCase()).then((body) => {
                msg.channel.send({
                    embed: {
                        title: "npm package",
                        color: 3066993,
                        fields: [
                            {
                                name: "Name",
                                value: body.body.name,
                                inline: true
                            },
                            {
                                name: "Author",
                                value: body.body.author.name,
                                inline: true
                            },
                            {
                                name: "Latest",
                                value: body.body["dist-tags"].latest,
                                inline: true
                            },
                            {
                                name: "GitHub",
                                value: ((body.body.repository) ? body.body.repository.url.replace("git+", "").replace(".git", "").replace("git://", "https://").replace("git@github.com:", "https://github.com/") : "No Repository"),
                                inline: true
                            },
                            {
                                name: "Maintainers",
                                value: body.body.maintainers.map((m) => m.name).join(", "),
                                inline: true
                            },
                            {
                                name: "Last Updated",
                                value: humanizeduration(Date.now() - new Date(body.body.time[body.body["dist-tags"].latest]).getTime(), {
                                    round: true,
                                    largest: 2
                                }),
                                inline: true
                            }
                        ]
                    }
                });
            }).catch((error) => {
                if (error.status === 404) return msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "Unable to find an npm package by that name."
                    }
                });
                msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "An unexpected error occured while fetching that npm package."
                    }
                });
                console.error("Failed to get information on npm package.", error.message);
            });
        } else {
            msg.channel.send({
                embed: {
                    title: "Error!",
                    color: 0xE50000,
                    description: "Missing `<name>` option."
                }
            });
        }
    }
};