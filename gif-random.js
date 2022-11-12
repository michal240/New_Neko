const gif_schema = require("./schema/gifs_schema");

async function gif_random(gif_type, author, target) {
  let urls = [];
  const gifs = await gif_schema.find({ type: gif_type }, ["url", "type"]);
  if (gifs.length) {
    for (let counter = 0; counter < gifs.length; ++counter) {
      const { url } = gifs[counter];
      urls.push(url);
    }
  }
  const wybrany = urls[Math.floor(Math.random() * urls.length)];
  let desc;
  if (gif_type === "gif_horny") {
    desc = `**${target.displayName}** idziesz do horny jail.`;
  }
  if (gif_type === "gif_drink") {
    desc = `**${author.displayName}** pije **${target.displayName}**`;
  }
  if (gif_type === "gif_steal") {
    desc = `*${author.displayName}** kradnie **${target.displayName}**`;
  }
  if (gif_type === "gif_lick") {
    desc = `*${author.displayName}** liże **${target.displayName}**`;
  }

  const data = {
    color: author.displayColor,
    image: {
      url: wybrany,
    },
    description: desc,
  };

  return data;
}

module.exports = { gif_random };
