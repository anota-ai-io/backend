const EventEmitter = require("events");

const CommentEmiter = new EventEmitter();

let activeSockets = {};

module.exports = {
  CommentEmiter,
  activeSockets,
};
