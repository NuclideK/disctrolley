const Jimp = require("jimp");
const fs = require("fs");

async function convertImage(input, output, text) {
  const image = await Jimp.read(input);
  const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
  image.resize(1000, 1000);
  image.blur(15);
  for (let i = 0; i < 1000; i++) {
    for (let j = 0; j < 80; j++) {
      image.setPixelColor(000000, i, j);
    }
  }
  image.print(font, 0, 0, text);
  await image.writeAsync(output);
}

let options = [];

module.exports = {
  key: "catorpossum",
  troll(req, res) {
    if (options.length < 1) {
      res.end("Nothing to display");
      return;
    }
    var img = fs.readFileSync(
      options[Math.floor(Math.random() * options.length)]
    );
    res.writeHead(200, { "Content-Type": "image/jpeg" });
    res.end(img, "binary");
  },
  async init() {
    const imageFiles = fs
      .readdirSync(`${__dirname}/input`)
      .filter((file) => file.endsWith(".jpg"));
    for (const file of imageFiles) {
      convertImage(
        `${__dirname}/input/${file}`,
        `${__dirname}/images/${file}`,
        "Can you identify this animal?"
      ).then(() => {
        options.push(`${__dirname}/images/${file}`);
      });
    }
  },
};
