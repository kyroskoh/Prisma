module.exports = (server, user, allowUsernames = true) => {
	return new Promise((resolve, reject) => {
		if (/^\d+$/.test(user)) {
			server.fetchMember(String(user), true).then((user) => resolve(user)).catch((e) => reject(e));
		} else if (/^<@\d+>$/.test(user)) {
			server.fetchMember(user.match(/\d+/)[0], true).then((user) => resolve(user)).catch((e) => reject(e));
		} else if (/^<@!\d+>$/.test(user)) {
			server.fetchMember(user.match(/\d+/)[0], true).then((user) => resolve(user)).catch((e) => reject(e));
		} else if (allowUsernames && /^\w+#\d{4}$/.test(user)) {
			const users = server.members.filter((u) => u.user.username === user.match(/^\w+/)[0] && u.user.discriminator === String(user.match(/\d{4}/)[0]));
			if (users.size > 0) {
				resolve(users.first());
			} else {
				reject();
			}
		} else if (allowUsernames) {
			server.members.fetchMembers().then((guild) => {
				const users = guild.members.filter((u) => u.user.username.toLowerCase().includes(user.toLowerCase()));
				if (users.first()) {
					resolve(users.first());
				} else {
					reject();
				}
			});
		}
	});
};