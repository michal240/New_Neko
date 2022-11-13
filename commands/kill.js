const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("kill")
    .setDescription("Zabijanie")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Kogo chcesz zabić?")
        .setRequired(true)
    ),
  async execute(interaction) {
    const target = interaction.options.getMember("cel");
    const author = interaction.member;
    const pozwolenie = ["533365521488543761", "459617415043481600"];
    const killed = ["528676042735484939", "261195977434726400"];

    if (!pozwolenie.includes(author.id)) {
      return interaction.reply({
        content: "Nie masz licencji na zabijanie.",
        ephemeral: true,
      });
    }
    if (!killed.includes(target.id)) {
      return interaction.reply("Musisz oznaczyć kogoś z listy.");
    }

    const embed = new EmbedBuilder()
      .setColor("#0000ff")
      .setTitle("")
      .setDescription(
        `**${author.displayName}** zabija **${target.displayName}**`
      )
      .setImage("https://c.tenor.com/HrBMJlqr9i4AAAAC/crow-killed.gif");
    return interaction.reply({ embeds: [embed] });
  },
};
