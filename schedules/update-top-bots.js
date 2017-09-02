const snekfetch = require("snekfetch");
const fs = require("fs");

module.exports = {
    interval: 1.8e6,
    execute: () => {
        snekfetch.get("https://www.carbonitex.net/discord/api/listedbots").then(body => {
            fs.writeFileSync("./data/bots.json", JSON.stringify(body.body, null, 4));
        });
    }
}