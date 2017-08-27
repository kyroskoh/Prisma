let steam = require("steam-webapi");
const config = require("../config.json");
const log = require("../managers/logger.js");

steam.key = config.api_keys.steam;

steam.ready(() => {
    steam = new steam();
    log("Successfully connected to Steam API!");
});

module.exports = steam;