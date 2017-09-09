const handleMessage = require("../functions/handle-message.js");

module.exports = (bot, r) => {
	bot.on("message", (msg) => {
		console.log("message");
		handleMessage(bot, r, msg)
	});
};