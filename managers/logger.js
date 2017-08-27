const dateformat = require("dateformat");

module.exports = (message) => {
    console.log(dateformat(Date.now(), "hh:MM:ss TT") + " | " + message);
};