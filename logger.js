const config_schema = require("./schema/config_schema");
const moment = require("moment");

async function logger(message, client) {
  const { author, channelId, guildId, content } = message;
  if (!author) {
    return;
  }
  const { username, id: authorId, avatar } = author;
  const config = await config_schema.findOne({ serverID: guildId });
  if (!config.logger_channel) {
    return;
  }
  console.log(guildId);
  console.log(config.serverID);
  console.log(config);
  if (guildId !== config.serverID) return;
  const channel = client.channels.cache.get(config.logger_channel);
  const deleted = moment().format("X");

  const mess = {
    author: {
      name: username,
      icon_url: `https://cdn.discordapp.com/avatars/${authorId}/${avatar}.webp?size=4096`,
    },
    fields: [
      {
        name: "Kanał",
        value: `<#${channelId}>`,
      },
      {
        name: "Zawartość wiadomości",
        value: content,
      },
      {
        name: "Kiedy usunięto",
        value: `<t:${deleted}:R>`,
      },
    ],
  };

  channel.send({ embeds: [mess] });
}

module.exports = { logger };
