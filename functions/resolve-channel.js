module.exports = (bot, channel) => {
    return new Promise((resolve, reject) => {
        if (/^\d+$/.test(channel)) {
            const newchannel = bot.channels.get(channel);
            if (newchannel) {
                resolve(newchannel);
            } else {
                reject();
            }
        } else if (/^<#\d+>$/.test(channel)) {
            const newchannel = bot.channels.get(channel.match(/\d+/)[0]);
            if (newchannel) {
                resolve(newchannel);
            } else {
                reject();
            }
        } else if (/^#.+$/.test(channel)) {
            const newchannel = bot.channels.find("name", channel.match(/[^#]+/)[0]);
            if (newchannel) {
                resolve(channels);
            } else {
                reject();
            }
        } else {
            const channels = bot.channels.find("name", channel);
            if (channels) {
                resolve(channels);
            } else {
                reject();
            }
        }
    });
};