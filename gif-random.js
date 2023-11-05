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
  switch (gif_type) {
    case "gif_horny":
      desc = `**${target.displayName}** idziesz do horny jail.`;
      break;
    case "gif_drink":
      desc = `**${author.displayName}** pije **${target.displayName}**`;
      break;
    case "gif_steal":
      desc = `**${author.displayName}** kradnie **${target.displayName}**`;
      break;
    case "gif_lick":
      desc = `**${author.displayName}** liże **${target.displayName}**`;
      break;
    case "gif_step":
      desc = `**${author.displayName}** staje na **${target.displayName}**`;
      break;
    case "gif_pan":
      desc = `**${author.displayName}** przypierdolił/a patelnią **${target.displayName}**`;
      break;
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
