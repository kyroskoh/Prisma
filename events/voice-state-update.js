module.exports = (bot, database) => {
    bot.on("voiceStateUpdate", (memberBefore, memberAfter) => {
        if (memberBefore.voiceChannel && !memberAfter.voiceChannel) {
            if (memberBefore.voiceChannel.members.get(bot.user.id)) {
                memberBefore.voiceChannel.queue.pipe.end();
            }
        }
    });
};