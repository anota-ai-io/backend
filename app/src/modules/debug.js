module.exports = {
  fileName() {
    const err = new Error();

    let file = "";

    if (err.stack.includes("/")) {
      // Unix Based Systemas
      file = err.stack.split("\n")[2].split("/").pop().split(":")[0].replace(")", "");
    } else {
      // Windows Based Systems
      file = err.stack.split("\n")[2].split("\\").pop().split(":")[0].replace(")", "");
    }

    return file + "-";
  },
};
