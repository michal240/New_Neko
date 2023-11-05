const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Pokazuje awatara")
    .addBooleanOption((option) =>
      option
        .setName("secret")
        .setDescription("Czy odpowiedź ma być sekretna?")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option.setName("target").setDescription("Czyj avatar chcesz zobaczyć")
    ),
  async execute(interaction) {
    const user = interaction.options.getMember("target");
    const embed = new EmbedBuilder()
      .setColor(interaction.member.displayColor)
      .setTitle(interaction.member.displayName)
      .setImage(
        interaction.member.displayAvatarURL({
          dynamic: true,
          size: 4096,
          format: "png",
        })
      );

    if (user) {
      embed.setColor(user.displayColor);
      embed.setImage(
        user.displayAvatarURL({
          dynamic: true,
          size: 4096,
          format: "png",
        })
      );
    }

    if (interaction.options.getBoolean("secret") === true) {
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    return interaction.reply({ embeds: [embed] });
  },
};
