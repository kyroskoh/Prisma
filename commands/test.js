const snekfetch = require("snekfetch");
const gm = require("gm");
const resolveUser = require("../functions/resolve-user.js");
const config = require("../config.json");
const imagesize = require("image-size");

module.exports = {
    commands: [
        "test"
    ],
    description: "A test command for new features.",
    usage: "test",
    category: "Image",
    hidden: true,
    execute: (bot, r, msg, args) => {
        if (msg.author.id !== config.trusted[0]) return;
        // do stuff
    }
};