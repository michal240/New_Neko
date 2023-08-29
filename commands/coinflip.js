/* eslint-disable no-useless-escape */
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const coin_schema = require("../schema/coin_shema");
const rn = require("random-number");
const wait = require("node:timers/promises").setTimeout;
module.exports = {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Coinfliping"),
  async execute(interaction) {
    const options = {
      min: 0,
      max: 1,
      integer: true,
    };
    let coin = ["tails", "heads"];
    const user = interaction.user.id;
    const result = coin[rn(options)];
    await coin_schema.findOneAndUpdate(
      { UserID: user },
      { UserID: user },
      { upsert: true }
    );

    const embed = new EmbedBuilder()
      .setColor(interaction.member.displayColor)
      .setTitle("Flipping")
      .setImage("https://i.imgur.com/Mi0EQI2.gif");
    await interaction.reply({ embeds: [embed] });
    await wait(2000);
    const schema = await coin_schema.findOne({ UserID: user });
    await schema.save();

    if (result === "heads") {
      schema.heads += 1;
      embed
        .setTitle("You've got **HEAD**")
        .setDescription("You have:")
        .addFields(
          {
            name: "\u200B",
            value: `${schema.heads} heads`,
          },
          { name: "\u200B", value: `${schema.tails} tails` }
        )
        .setImage("https://i.imgur.com/3mcEYWr.png");
    }
    if (result === "tails") {
      schema.tails += 1;
      embed
        .setTitle("You've got **TAIL**")
        .addFields(
          {
            name: "\u200B",
            value: `${schema.heads} heads`,
          },
          { name: "\u200B", value: `${schema.tails} tails` }
        )
        .setImage("https://i.imgur.com/78IZ2MP.png");
    }
    await schema.save();

    await interaction.editReply({ embeds: [embed] });
  },
};
