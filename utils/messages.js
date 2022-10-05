const moment = require("moment");

function formatMessage(id, username, text) {
  console.log(id);
  return {
    id,
    username,
    text,
    time: moment().format("h:mm a"),
  };
}

module.exports = formatMessage;
