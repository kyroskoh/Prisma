module.exports = (bot, server) => {
	return new Promise((resolve, reject) => {
		if (/\d+/.test(server)) {
			const servercheck = bot.guilds.get(server);
			if (servercheck) {
				resolve(servercheck);
			} else {
				reject();
			}
		} else {
			const servercheck = bot.guilds.filter((g) => g.name.toLowerCase().includes(server.toLowerCase()));
			if (servercheck.size > 0) {
				resolve(servercheck.first());
			} else {
				reject();
			}
		}
	});
};