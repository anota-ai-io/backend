const fs = require("fs");

module.exports = {
  base64Encode(file) {
    const base64 = fs.readFileSync(file, "base64");
    return base64;
  },
};
