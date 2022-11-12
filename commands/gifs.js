const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { gif_random } = require("../gif-random");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("gifs")
    .setDescription("Róźne gify.")
    .addStringOption((option) =>
      option
        .setName("kategoria")
        .setDescription("Kategorie gifów")
        .setRequired(true)
        .addChoices(
          { name: "horny", value: "gif_horny" },
          { name: "drink", value: "gif_drink" },
          { name: "steal", value: "gif_steal" },
          { name: "lick", value: "gif_lick" }
        )
    )
    .addUserOption((option) =>
      option
        .setName("cel")
        .setDescription("Na kim chcesz użyć gifa?")
        .setRequired(true)
    ),
  async execute(interaction) {
    const gif_type = interaction.options.getString("kategoria");
    const target = interaction.options.getMember("cel");
    const author = interaction.member;
    const gif = await gif_random(gif_type, author, target);
    console.log(gif);
    const embed = new EmbedBuilder(gif);
    return interaction.reply({ embeds: [embed] });
  },
};
