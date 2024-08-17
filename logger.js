import config_schema from "./schema/config_schema.js";
import moment from "moment";
import { AttachmentBuilder } from "discord.js";
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
  if (guildId !== config.serverID) return;
  const channel = client.channels.cache.get(config.logger_channel);
  const deleted = moment().format("X");
  let pics = [];
  message.attachments.map((att) =>
    pics.push(new AttachmentBuilder().setFile(att.attachment).setName(att.name))
  );
  console.log(message);
  const fetchedLogs = await message.guild.fetchAuditLogs({
    action: 72,
    limit: 1,
  });
  const deletionLog = fetchedLogs.entries.first();
  console.log(deletionLog);
  let deleter;
  if (deletionLog.action) {
    deleter = deletionLog.executor;
  } else {
    deleter = message.author;
  }
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
      {
        name: "Kto usunął",
        value: `${deleter}`,
      },
    ],
  };

  channel.send({ embeds: [mess], files: pics });
}

export { logger };
