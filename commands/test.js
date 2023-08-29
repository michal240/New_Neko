const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { twitch_streamers, twitch_check } = require("./../twitch");
const live_schema = require("./../schema/live_schema");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("test")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const interval = 36000000;

    const channel = interaction.client.channels.cache.get("845643327209865236");

    const streamers = await twitch_streamers();
    console.log(streamers);
    for (const streamer of streamers) {
      const content = await twitch_check(streamer);
      if (content) {
        const online = await live_schema.findOne({ url: content });

        const las_live = Date.now() - online.updatedAt;
        if (!online.updatedAt) {
          channel.send(`${content}`);

          await live_schema.findOneAndUpdate(
            { url: content },
            { timestamps: true }
          );
        } else if (las_live > interval) {
          channel.send(`${content}`);
          await live_schema.findOneAndUpdate(
            { url: content },
            { timestamps: true }
          );
        }
      }
    }

    return interaction.reply("testing");
  },
};
