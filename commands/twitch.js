const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const live_schema = require("../schema/live_schema");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("twitch")
    .setDescription("Zarządzanie bazą kanałów")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Dodawanie kanałów.")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("Link do kanału.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("list").setDescription("Lista kanałów.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Usuwanie kanałów.")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("Link do kanału.")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const link = interaction.options.getString("url");
    const path = new URL(link).pathname;
    const name = path.slice(1);
    if (interaction.options.getSubcommand() === "add") {
      await live_schema.findOneAndUpdate(
        {
          url: link,
        },
        {
          url: link,
          name: name,
        },
        {
          upsert: true,
          timestamps: false,
        }
      );
      return interaction.reply({
        content: `Dodano ${link} do bazy danych.`,
        ephemeral: true,
      });
    }
    if (interaction.options.getSubcommand() === "list") {
      let urls = [];
      const gifs = await live_schema.find();
      if (gifs.length) {
        urls.push(gifs.map((links) => links.url).join(" \n "));
        console.log(urls);
      } else {
        return interaction.reply("Baza danych jest pusta.");
      }
      const embed = new EmbedBuilder()
        .setTitle("**Streamerzy**")
        .setDescription(`${urls}`);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    if (interaction.options.getSubcommand() === "delete") {
      await live_schema.findOneAndDelete({
        url: link,
      });

      return interaction.reply({
        content: `${link}`,
        ephemeral: true,
      });
    }
  },
};