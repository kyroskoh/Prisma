const handleMessage = require("../functions/handle-message.js");

module.exports = (bot, r) => {
	bot.on("messageUpdate", (oldmsg, newmsg) => {
		console.log("messageUpdate");
		handleMessage(bot, r, newmsg)
	});
};