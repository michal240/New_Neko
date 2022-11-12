const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Informacje o użytkowniku.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addBooleanOption((option) =>
      option
        .setName("secret")
        .setDescription("Czy odpowiedź ma być sekretna?")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Czyje informacje chcesz zobaczyć?")
    ),
  async execute(interaction) {
    let MemberName;
    let id;
    let discriminator;
    let avatar;
    const user = interaction.options.getMember("target");
    const author = interaction.member;
    if (user) {
      MemberName = user.displayName;
      id = user.id;
      avatar = user.displayAvatarURL({
        dynamic: true,
        size: 2048,
        format: "png",
      });
      console.log(MemberName, id, discriminator, avatar);
      return interaction.reply("test");
    }
    MemberName = author.displayName;
    id = author.id;

    avatar = author.displayAvatarURL({
      dynamic: true,
      size: 2048,
      format: "png",
    });

    console.log(MemberName, id, avatar);

    return interaction.reply({ comtent: [embed], ephemeral: true });
  },
};
