const steam = require("../functions/steam.js")();
const humanizeduration = require("humanize-duration");
const handleDatabaseError = require("../functions/handle-database-error.js");
const config = require("../config.json");

module.exports = {
    commands: [
        "steamuserinfo",
        "steamuser",
        "suser",
        "sui"
    ],
    description: "View information about a Steam user.",
    usage: "steamuserinfo [vanity URL | steamID]",
    category: "Utility",
    hidden: false,
    execute: (bot, database, msg, args) => {
        return msg.channel.send({
            embed: {
                title: "Information!",
                color: 1030633,
                description: "This command has been disabled because of instability."
            }
        });
        if (args.length > 0) {
            if (/^\d+$/.test(args[0])) {
                steam.getPlayerSummaries({
                    steamids: args[0]
                }, (error, summary) => {
                    if (error || summary.players.length < 1) return msg.channel.send({
                        embed: {
                            title: "Error!",
                            color: 0xE50000,
                            description: "Either an error occured while fetching user summary or that Steam ID is invalid."
                        }
                    });
                    if (summary.players[0].communityvisibilitystate !== 3) return msg.channel.send({
                        embed: {
                            title: "Error!",
                            color: 0xE50000,
                            description: "That profile is private. I cannot get information on a profile that is private."
                        }
                    });
                    steam.getUserGroupList({
                        steamid: args[0]
                    }, (error, groups) => {
                        if (error) return msg.channel.send({
                            embed: {
                                title: "Error!",
                                color: 0xE50000,
                                description: "Either an error occured while fetching user summary or that Steam ID is invalid."
                            }
                        });
                        steam.getFriendList({
                            steamid: args[0]
                        }, (error, friends) => {
                            if (error) return msg.channel.send({
                                embed: {
                                    title: "Error!",
                                    color: 0xE50000,
                                    description: "Either an error occured while fetching user summary or that Steam ID is invalid."
                                }
                            });
                            steam.getRecentlyPlayedGames({
                                steamid: args[0],
                                count: 1
                            }, (error, recetlyplayed) => {
                                if (error) return msg.channel.send({
                                    embed: {
                                        title: "Error!",
                                        color: 0xE50000,
                                        description: "Either an error occured while fetching user summary or that Steam ID is invalid."
                                    }
                                });
                                steam.getOwnedGames({
                                    steamid: args[0],
                                    include_appinfo: true,
                                    include_played_free_games: true,
                                    appids_filter: 0
                                }, (error, games) => {
                                    if (error) return msg.channel.send({
                                        embed: {
                                            title: "Error!",
                                            color: 0xE50000,
                                            description: "Either an error occured while fetching user summary or that Steam ID is invalid."
                                        }
                                    });
                                    steam.getSteamLevel({
                                        steamid: args[0]
                                    }, (error, level) => {
                                        if (error) return msg.channel.send({
                                            embed: {
                                                title: "Error!",
                                                color: 0xE50000,
                                                description: "Either an error occured while fetching user summary or that Steam ID is invalid."
                                            }
                                        });
                                        const most_played_game = games.games.sort((a, b) => b.playtime_forever - a.playtime_forever)[0];
                                        msg.channel.send({
                                            embed: {
                                                title: "Steam User Information",
                                                color: 3066993,
                                                fields: [
                                                    {
                                                        name: "Real Name",
                                                        value: ((summary.players[0].realname) ? summary.players[0].realname : "Unknown"),
                                                        inline: true
                                                    },
                                                    {
                                                        name: "Status",
                                                        value: ((summary.players[0].personastate === 0) ? "Offline" : ((summary.players[0].personastate === 1) ? "Online" : ((summary.players[0].personastate === 2) ? "Busy" : ((summary.players[0].personastate === 3) ? "Away" : ((summary.players[0].personastate === 4) ? "Snooze" : ((summary.players[0].personastate === 5) ? "Looking to Trade" : ((summary.players[0].personastate === 6) ? "Looking to Play" : "Unknown"))))))),
                                                        inline: true
                                                    },
                                                    {
                                                        name: "Level",
                                                        value: ((level.player_level) ? level.player_level : "Unknown"),
                                                        inline: true
                                                    },
                                                    {
                                                        name: "In-Game",
                                                        value: ((summary.players[0].gameid) ? ((games.games.filter(v => v.appid === summary.players[0].gameid).length > 0) ? games.games.filter(v => v.appid === summary.players[0].gameid)[0].name : "Unknown") : "No"),
                                                        inline: true
                                                    },
                                                    {
                                                        name: "Friends",
                                                        value: friends.friendslist.friends.length,
                                                        inline: true
                                                    },
                                                    {
                                                        name: "Groups",
                                                        value: groups.groups.length,
                                                        inline: true
                                                    },
                                                    {
                                                        name: "Most Played Game",
                                                        value: most_played_game.name + " (" + humanizeduration(most_played_game.playtime_forever * 100000, {
                                                            language: "shortEn",
                                                            round: true,
                                                            spacer: "",
                                                            delimiter: "",
                                                            languages: {
                                                                shortEn: {
                                                                    y: function() {
                                                                        return 'y'
                                                                    },
                                                                    mo: function() {
                                                                        return 'mo'
                                                                    },
                                                                    w: function() {
                                                                        return 'w'
                                                                    },
                                                                    d: function() {
                                                                        return 'd'
                                                                    },
                                                                    h: function() {
                                                                        return 'h'
                                                                    },
                                                                    m: function() {
                                                                        return 'm'
                                                                    },
                                                                    s: function() {
                                                                        return 's'
                                                                    },
                                                                    ms: function() {
                                                                        return 'ms'
                                                                    },
                                                                }
                                                            }
                                                        }) + ")",
                                                        inline: true
                                                    }
                                                ]
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            } else {
                steam.resolveVanityURL({
                    vanityurl: encodeURIComponent(args.join(" ")),
                    url_type: 1
                }, (error, user) => {
                    if (error || user.success === 42) return msg.channel.send({
                        embed: {
                            title: "Error!",
                            color: 0xE50000,
                            description: "Either an error occured while fetching Steam ID or that vanity URL is invalid."
                        }
                    });
                    steam.getPlayerSummaries({
                        steamids: user.steamid
                    }, (error, summary) => {
                        if (error || summary.players.length < 1) return msg.channel.send({
                            embed: {
                                title: "Error!",
                                color: 0xE50000,
                                description: "Either an error occured while fetching user summary or your Steam ID that is linked is invalid. Please re-use the `linksteam` command and try again."
                            }
                        });
                        if (summary.players[0].communityvisibilitystate !== 3) return msg.channel.send({
                            embed: {
                                title: "Error!",
                                color: 0xE500000,
                                description: "Your profile is private. I cannot get information on a profile that is private."
                            }
                        });
                        steam.getUserGroupList({
                            steamid: user.steamid
                        }, (error, groups) => {
                            if (error) return msg.channel.send({
                                embed: {
                                    title: "Error!",
                                    color: 0xE50000,
                                    description: "Either an error occured while fetching user group list or your Steam ID that is linked is invalid. Please re-use the `linksteam` command and try again."
                                }
                            });
                            steam.getFriendList({
                                steamid: user.steamid
                            }, (error, friends) => {
                                if (error) return msg.channel.send({
                                    embed: {
                                        title: "Error!",
                                        color: 0xE50000,
                                        description: "Either an error occured while fetching friend list or your Steam ID that is linked is invalid. Please re-use the `linksteam` command and try again."
                                    }
                                });
                                steam.getRecentlyPlayedGames({
                                    steamid: user.steamid,
                                    count: 1
                                }, (error, recetlyplayed) => {
                                    if (error) return msg.channel.send({
                                        embed: {
                                            title: "Error!",
                                            color: 0xE50000,
                                            description: "Either an error occured while fetching recently played games or your Steam ID that is linked is invalid. Please re-use the `linksteam` command and try again."
                                        }
                                    });
                                    steam.getOwnedGames({
                                        steamid: user.steamid,
                                        include_appinfo: true,
                                        include_played_free_games: true,
                                        appids_filter: 0
                                    }, (error, games) => {
                                        if (error) return msg.channel.send({
                                            embed: {
                                                title: "Error!",
                                                color: 0xE50000,
                                                description: "Either an error occured while fetching owned games or your Steam ID that is linked is invalid. Please re-use the `linksteam` command and try again."
                                            }
                                        });
                                        steam.getSteamLevel({
                                            steamid: user.steamid
                                        }, (error, level) => {
                                            if (error) return msg.channel.send({
                                                embed: {
                                                    title: "Error!",
                                                    color: 0xE50000,
                                                    description: "Either an error occured while fetching steam level or your Steam ID that is linked is invalid. Please re-use the `linksteam` command and try again."
                                                }
                                            });
                                            const most_played_game = games.games.sort((a, b) => b.playtime_forever - a.playtime_forever)[0];
                                            msg.channel.send({
                                                embed: {
                                                    title: "Steam User Information",
                                                    color: 3066993,
                                                    fields: [
                                                        {
                                                            name: "Real Name",
                                                            value: ((summary.players[0].realname) ? summary.players[0].realname : "Unknown"),
                                                            inline: true
                                                        },
                                                        {
                                                            name: "Status",
                                                            value: ((summary.players[0].personastate === 0) ? "Offline" : ((summary.players[0].personastate === 1) ? "Online" : ((summary.players[0].personastate === 2) ? "Busy" : ((summary.players[0].personastate === 3) ? "Away" : ((summary.players[0].personastate === 4) ? "Snooze" : ((summary.players[0].personastate === 5) ? "Looking to Trade" : ((summary.players[0].personastate === 6) ? "Looking to Play" : "Unknown"))))))),
                                                            inline: true
                                                        },
                                                        {
                                                            name: "Level",
                                                            value: ((level.player_level) ? level.player_level : "Unknown"),
                                                            inline: true
                                                        },
                                                        {
                                                            name: "In-Game",
                                                            value: ((summary.players[0].gameid) ? ((games.games.filter(v => v.appid === summary.players[0].gameid).length > 0) ? games.games.filter(v => v.appid === summary.players[0].gameid)[0].name : "Unknown") : "No"),
                                                            inline: true
                                                        },
                                                        {
                                                            name: "Friends",
                                                            value: friends.friendslist.friends.length,
                                                            inline: true
                                                        },
                                                        {
                                                            name: "Groups",
                                                            value: groups.groups.length,
                                                            inline: true
                                                        },
                                                        {
                                                            name: "Most Played Game",
                                                            value: most_played_game.name + " (" + humanizeduration(most_played_game.playtime_forever * 100000, {
                                                                language: "shortEn",
                                                                round: true,
                                                                spacer: "",
                                                                delimiter: "",
                                                                languages: {
                                                                    shortEn: {
                                                                        y: function() {
                                                                            return 'y'
                                                                        },
                                                                        mo: function() {
                                                                            return 'mo'
                                                                        },
                                                                        w: function() {
                                                                            return 'w'
                                                                        },
                                                                        d: function() {
                                                                            return 'd'
                                                                        },
                                                                        h: function() {
                                                                            return 'h'
                                                                        },
                                                                        m: function() {
                                                                            return 'm'
                                                                        },
                                                                        s: function() {
                                                                            return 's'
                                                                        },
                                                                        ms: function() {
                                                                            return 'ms'
                                                                        },
                                                                    }
                                                                }
                                                            }) + ")",
                                                            inline: true
                                                        }
                                                    ]
                                                }
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            }
        } else {
            database.all("SELECT * FROM steam_profiles WHERE userID = ?", [msg.author.id], (error, response) => {
                if (error) return handleDatabaseError(bot, error, msg);
                if (response.length > 0) {
                    steam.getPlayerSummaries({
                        steamids: response[0].id
                    }, (error, summary) => {
                        if (error || summary.players.length < 1) return msg.channel.send({
                            embed: {
                                title: "Error!",
                                color: 0xE50000,
                                description: "Either an error occured while fetching user summary or your Steam ID that is linked is invalid. Please re-use the `linksteam` command and try again."
                            }
                        });
                        if (summary.players[0].communityvisibilitystate !== 3) return msg.channel.send({
                            embed: {
                                title: "Error!",
                                color: 0xE50000,
                                description: "Your profile is private. I cannot get information on a profile that is private."
                            }
                        });
                        steam.getUserGroupList({
                            steamid: response[0].id
                        }, (error, groups) => {
                            if (error) return msg.channel.send({
                                embed: {
                                    title: "Error!",
                                    color: 0xE50000,
                                    description: "Either an error occured while fetching user group list or your Steam ID that is linked is invalid. Please re-use the `linksteam` command and try again."
                                }
                            });
                            steam.getFriendList({
                                steamid: response[0].id
                            }, (error, friends) => {
                                if (error) return msg.channel.send({
                                    embed: {
                                        title: "Error!",
                                        color: 0xE50000,
                                        description: "Either an error occured while fetching friend list or your Steam ID that is linked is invalid. Please re-use the `linksteam` command and try again."
                                    }
                                });
                                steam.getRecentlyPlayedGames({
                                    steamid: response[0].id,
                                    count: 1
                                }, (error, recetlyplayed) => {
                                    if (error) return msg.channel.send({
                                        embed: {
                                            title: "Error!",
                                            color: 0xE50000,
                                            description: "Either an error occured while fetching recently played games or your Steam ID that is linked is invalid. Please re-use the `linksteam` command and try again."
                                        }
                                    });
                                    steam.getOwnedGames({
                                        steamid: response[0].id,
                                        include_appinfo: true,
                                        include_played_free_games: true,
                                        appids_filter: 0
                                    }, (error, games) => {
                                        if (error) return msg.channel.send({
                                            embed: {
                                                title: "Error!",
                                                color: 0xE50000,
                                                description: "Either an error occured while fetching owned games or your Steam ID that is linked is invalid. Please re-use the `linksteam` command and try again."
                                            }
                                        });
                                        steam.getSteamLevel({
                                            steamid: response[0].id
                                        }, (error, level) => {
                                            if (error) return msg.channel.send({
                                                embed: {
                                                    title: "Error!",
                                                    color: 0xE50000,
                                                    description: "Either an error occured while fetching steam level or your Steam ID that is linked is invalid. Please re-use the `linksteam` command and try again."
                                                }
                                            });
                                            const most_played_game = games.games.sort((a, b) => b.playtime_forever - a.playtime_forever)[0];
                                            msg.channel.send({
                                                embed: {
                                                    title: "Steam User Information",
                                                    color: 3066993,
                                                    fields: [
                                                        {
                                                            name: "Real Name",
                                                            value: ((summary.players[0].realname) ? summary.players[0].realname : "Unknown"),
                                                            inline: true
                                                        },
                                                        {
                                                            name: "Status",
                                                            value: ((summary.players[0].personastate === 0) ? "Offline" : ((summary.players[0].personastate === 1) ? "Online" : ((summary.players[0].personastate === 2) ? "Busy" : ((summary.players[0].personastate === 3) ? "Away" : ((summary.players[0].personastate === 4) ? "Snooze" : ((summary.players[0].personastate === 5) ? "Looking to Trade" : ((summary.players[0].personastate === 6) ? "Looking to Play" : "Unknown"))))))),
                                                            inline: true
                                                        },
                                                        {
                                                            name: "Level",
                                                            value: ((level.player_level) ? level.player_level : "Unknown"),
                                                            inline: true
                                                        },
                                                        {
                                                            name: "In-Game",
                                                            value: ((summary.players[0].gameid) ? ((games.games.filter(v => v.appid === summary.players[0].gameid).length > 0) ? games.games.filter(v => v.appid === summary.players[0].gameid)[0].name : "Unknown") : "No"),
                                                            inline: true
                                                        },
                                                        {
                                                            name: "Friends",
                                                            value: friends.friendslist.friends.length,
                                                            inline: true
                                                        },
                                                        {
                                                            name: "Groups",
                                                            value: groups.groups.length,
                                                            inline: true
                                                        },
                                                        {
                                                            name: "Most Played Game",
                                                            value: most_played_game.name + " (" + humanizeduration(most_played_game.playtime_forever * 100000, {
                                                                language: "shortEn",
                                                                round: true,
                                                                spacer: "",
                                                                delimiter: "",
                                                                languages: {
                                                                    shortEn: {
                                                                        y: function() {
                                                                            return 'y'
                                                                        },
                                                                        mo: function() {
                                                                            return 'mo'
                                                                        },
                                                                        w: function() {
                                                                            return 'w'
                                                                        },
                                                                        d: function() {
                                                                            return 'd'
                                                                        },
                                                                        h: function() {
                                                                            return 'h'
                                                                        },
                                                                        m: function() {
                                                                            return 'm'
                                                                        },
                                                                        s: function() {
                                                                            return 's'
                                                                        },
                                                                        ms: function() {
                                                                            return 'ms'
                                                                        },
                                                                    }
                                                                }
                                                            }) + ")",
                                                            inline: true
                                                        }
                                                    ]
                                                }
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                } else {
                    msg.channel.send({
                        embed: {
                            title: "Error!",
                            color: 0xE50000,
                            description: "Missing `[vanity URL | steamID]` option. You can also link your profile using `linksteam`."
                        }
                    });
                }
            });
        }
    }
};