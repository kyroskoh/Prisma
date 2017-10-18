const config = require("../config.json");

module.exports = (data) => {
	return data
		.split(config.token).join("-- BOT TOKEN --")
		.split(config.api_keys.bot_list["discordbots.org"]).join("-- discordbots.org API KEY --")
		.split(config.api_keys.bot_list["bots.discord.pw"]).join("-- bots.discord.pw API KEY --")
		.split(config.rethink.host).join("-- RETHINKDB HOST IP ADDRESS --")
		.split(config.api_keys.youtube).join("-- YOUTUBE API KEY --")
		.split(config.api_keys.steam).join("-- STEAM API KEY --")
		.split(config.api_keys.thecatapi).join("-- RANDOM CAT API KEY --")
		.split(config.api_keys.openweathermap).join("-- OPENWEATHERMAP API KEY --")
		.split(config.api_keys.imgur).join("-- IMGUR API KEY --")
		.split(config.api_keys.cleverbot[0]).join("-- CLEVERBOT USER KEY --")
		.split(config.api_keys.cleverbot[1]).join("-- CLEVERBOT API KEY --");
};