const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const gif_schema = require("../schema/gifs_schema");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("gif")
    .setDescription("Get info about a user or a server!")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Dodawanie gifów.")
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
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("Link do gifa.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("Lista gifów.")
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
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Usuwanie gifów.")

        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("Link do gifa.")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const gif_type = interaction.options.getString("kategoria");
    const link = interaction.options.getString("url");
    if (interaction.options.getSubcommand() === "list") {
      let urls = [];
      const gifs = await gif_schema.find({ type: gif_type }, ["url"]);
      if (gifs.length) {
        urls.push(gifs.map((links) => links.url).join(" \n "));
        console.log(urls);
      } else {
        return interaction.reply("Baza danych jest pusta.");
      }
      const embed = new EmbedBuilder()
        .setTitle(`${gif_type}`)
        .setDescription(`${urls}`);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    if (interaction.options.getSubcommand() === "add") {
      await gif_schema.findOneAndUpdate(
        {
          url: link,
        },
        {
          url: link,
          type: gif_type,
        },
        {
          upsert: true,
        }
      );
      return interaction.reply({
        content: `Dodano ${gif_type} do bazy danych. ${link}`,
        ephemeral: true,
      });
    }
    if (interaction.options.getSubcommand() === "delete") {
      await gif_schema.findOneAndDelete({
        url: link,
      });

      return interaction.reply({
        content: `${link}`,
        ephemeral: true,
      });
    }
  },
};
