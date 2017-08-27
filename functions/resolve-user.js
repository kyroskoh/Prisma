module.exports = (bot, user) => {
    return new Promise((resolve, reject) => {
        if (/^\d+$/.test(user)) {
            bot.fetchUser(String(user), true).then(user => resolve(user)).catch(e => reject(e));
        } else if (/^<@\d+>$/.test(user)) {
            bot.fetchUser(user.match(/\d+/)[0], true).then(user => resolve(user)).catch(e => reject(e));
        } else if (/^\w+#\d{4}$/.test(user)) {
            const users = bot.users.filter(u => u.username === user.match(/^\w+/)[0] && u.discriminator === String(user.match(/\d{4}/)[0]));
            if (users.size > 0) {
                resolve(users.first());
            } else {
                reject();
            }
        } else if (/^\w+$/) {
            const users = bot.users.filter(u => u.username.toLowerCase().includes(user.toLowerCase()));
            if (users) {
                resolve(users);
            } else {
                reject();
            }
        } else {
            reject();
        }
    });
};