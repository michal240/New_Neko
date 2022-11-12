const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const gifs_schema = require('../schema/gifs_schema')
module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Testowe!")
    .addStringOption((option) =>
          option
            .setName("kategoria")
            .setDescription("Kategorie gifów")
            .setRequired(true)
            .addChoices(
              { name: "horny", value: "gif_horny" },
              { name: "drink", value: "gif_drink" }
            )
        )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const gif_type = interaction.options.getString("kategoria");
      const gifs = await gifs_schema.find({ type: gif_type }, ["url"]);

console.log(gifs);
        return interaction.reply('test');
  },
};
