const { SlashCommandBuilder } = require("discord.js");
const vote_schema = require("../schema/vote_schema");
const poll_schema = require("../schema/poll_schema");

module.exports = {
  cooldown: 24 * 60 * 60,
  data: new SlashCommandBuilder()
    .setName("voting")
    .setDescription("Oddaj swój głos.")
    .addIntegerOption((option) =>
      option
        .setName("vote")
        .setDescription("Na co głosujesz.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const voted = interaction.options.getInteger("vote");

    if (isNaN(voted)) {
      return interaction.reply({
        content: "Muisz wpisać liczbę.",
        ephemeral: true,
      });
    }

    const userID = interaction.member.id;
    const channelID = interaction.channel.id;
    const poll = await poll_schema.findOne({ channelID });
    console.log(voted);
    console.log(poll.vote_options.length - 1);
    if (voted > poll.vote_options.length - 1) {
      return interaction.reply({
        content: "Nie ma takiej opcji.",
        ephemeral: true,
      });
    }
    await vote_schema.findOneAndUpdate(
      { userID, channelID },
      { userID, channelID, voted },
      {
        upsert: true,
      }
    );

    return interaction.reply({
      content: `Zagłosowałeś na ${voted}`,
      ephemeral: true,
    });
  },
};
