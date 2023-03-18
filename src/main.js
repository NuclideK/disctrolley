const http = require("http");
const url = require("url");
const fs = require("fs");

const port = process.env.PORT || "8080";

let trolls = {};

const trollFolders = fs.readdirSync("./src/trolls/");
for (const folder of trollFolders) {
  const trollFiles = fs
    .readdirSync(`./src/trolls/${folder}/`)
    .filter((file) => file.endsWith(".js"));
  for (const file of trollFiles) {
    let troll = require(`./trolls/${folder}/${file}`);
    if (troll.init) troll.init();

    trolls[troll.key] = troll;
    console.log(`✅ Loaded troll ${troll.key}`);
  }
}

function isDiscord(req) {
  let userAgent = req.headers["user-agent"];
  var discordAgents = [
    "DiscordBot",
    "+https://discordapp.com",
    "electron",
    "discord",
    "Discordbot/2.0",
    "firefox/38",
    "Gecko/20100101",
  ];
  let isDiscord = false;
  discordAgents.forEach((discordAgent) => {
    if (userAgent.includes(discordAgent)) {
      isDiscord = true;
    }
  });
  return isDiscord;
}

function serveContent(req, res) {
  if (!TESTING) {
    if (!isDiscord(req)) return rickroll(res); // Rickroll the real users
  }

  let request = url.parse(req.url, true);
  let path = request.path.replace("/", "").split("?")[0];
  if (path in trolls) {
    trolls[path].troll(req, res);
  } else {
    res.end();
  }
}

function rickroll(res) {
  res.writeHead(302, { Location: "https://youtu.be/o-YBDTqX_ZU" }).end();
}

http.createServer(serveContent).listen(port);

TESTING = false;
console.log(`Listening on: ${port}`);
