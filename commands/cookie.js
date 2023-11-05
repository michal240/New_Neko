const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const gif_schema = require("./../schema/gifs_schema");
const cookie_schema = require("./../schema/cookie_schema");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("cookie")
    .setDescription("Daj ciacho.")

    .addUserOption((option) =>
      option
        .setName("cel")
        .setDescription("Komu chcesz dać ciacho?")
        .setRequired(true)
    ),
  async execute(interaction) {
    const target = interaction.options.getMember("cel");
    const author = interaction.member;

    if (target === author) {
      return interaction.reply({
        content: "Nie możesz dać ciasteczka samemu sobie.",
        ephemeral: true,
      });
    }
    if (target.user.bot === true) {
      return interaction.reply({
        content: "Nie możesz dać ciasteczka botowi.",
        ephemeral: true,
      });
    }
    let urls = [];
    const gifs = await gif_schema.find({ type: "gif_cookie" }, ["url", "type"]);
    console.log(gifs);
    if (gifs.length) {
      for (let counter = 0; counter < gifs.length; ++counter) {
        const { url } = gifs[counter];
        urls.push(url);
      }
    }
    const wybrany = urls[Math.floor(Math.random() * urls.length)];
    const cookies_taker = await cookie_schema.findOneAndUpdate(
      { UserID: target.id },
      {
        $inc: {
          taken: 1,
        },
      },
      { upsert: true }
    );
    await cookie_schema.findOneAndUpdate(
      { UserID: author.id },
      {
        $inc: {
          given: 1,
        },
      },
      { upsert: true }
    );
    const tooked = cookies_taker?.taken ?? 1;
    console.log(wybrany);
    const embed = new EmbedBuilder()
      .setColor(interaction.member.displayColor)
      .setDescription(
        `**${author.displayName}** daje ciasteczko **${target.displayName}**`
      )
      .setImage(wybrany)
      .addFields(
        {
          name: "\u200B",
          value: `<:taken:1161385565883748373> ${tooked + 1}`,
          inline: true,
        },
        {
          name: "\u200B",
          value: `<:given:1161385563304247466> ${cookies_taker?.given ?? 0}`,
          inline: true,
        }
      );

    return interaction.reply({ embeds: [embed] });
  },
};
