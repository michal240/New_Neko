const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const game_schema = require("./../schema/game_schema");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("game profile"),
  async execute(interaction) {
    const author = interaction.member;
    const { displayName, displayColor } = author;
    console.log(author.displayName);
    const profile = await game_schema.findOne({ UserID: author.id });
    const embed = new EmbedBuilder()
      .setTitle(displayName)
      .setThumbnail(
        author.displayAvatarURL({
          dynamic: true,
          size: 2048,
          format: "png",
        })
      )
      .setColor(displayColor)
      .addFields(
        { name: "Coins", value: `${profile.coins}` },
        { name: "Wins", value: `${profile.wins}` },
        { name: "Losses", value: `${profile.losses}` }
      );
    return interaction.reply({ embeds: [embed] });
  },
};
