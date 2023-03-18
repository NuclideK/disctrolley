module.exports = {
  key: "example",
  troll(req, res) {
    // res.writeHead(302, { Location: "https://youtu.be/o-YBDTqX_ZU" });
    res.end("functional!");
  },
  async init() {},
};
