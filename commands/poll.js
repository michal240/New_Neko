const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const poll_schema = require("../schema/poll_schema");
const vote_schema = require("../schema/vote_schema");
const _ = require("underscore");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Setup głosowania")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Dodawanie opcji.")
        .addStringOption((option) =>
          option
            .setName("kandydaci")
            .setDescription("Kandydaci do głosowania")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("Kategoria ankiety")
            .setRequired(true)
            .addChoices(
              { name: "text", value: "text_poll" },
              { name: "pics", value: "pics_poll" }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("list").setDescription("Lista dodanych już opcji.")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("count").setDescription("Liczenie głosów.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Usuwanie opcji.")
        .addStringOption((option) =>
          option
            .setName("erase")
            .setDescription("Usuń kandydata z listy")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("end").setDescription("Skończenie głosowania")
    ),
  async execute(interaction) {
    if (interaction.member.id !== "581425303625138187") {
      return interaction.reply("Nie masz uprawnień.");
    }
    const channelID = interaction.channel.id;

    if (interaction.options.getSubcommand() === "add") {
      const type = interaction.options.getString("type");
      if (type === "text_poll") {
        const filter = (m) => m.member.id === interaction.member.id;

        interaction
          .reply({
            content:
              "Wyślij opcje, które chcesz dodać do ankiety. Pamiętaj by oddzielić je przecinkami! Max 10.",
            fetchReply: true,
            ephemeral: true,
          })
          .then(() => {
            interaction.channel
              .awaitMessages({
                filter: filter,
                max: 1,
                time: 30000,
                errors: ["time"],
              })
              .then(async (collected) => {
                const e = collected.map((element) => {
                  return element;
                });
                interaction.channel.messages.delete(e[0].id);
                let text = "";
                const old_votes = await poll_schema.findOne({ channelID });
                console.log(old_votes);
                if (old_votes !== null) {
                  new_votes = old_votes.vote_options.concat(votes);
                }
                const content = e[0].content.split(", ");
                for (let counter = 0; counter < content.length; ++counter) {
                  text += `**${counter + 1}**: ${content[counter]} \n`;
                }
                interaction.followUp({ content: text, ephemeral: true });
              })
              .catch((collected) => {
                console.log(collected);
                interaction.followUp(
                  "Looks like nobody got the answer this time."
                );
              });
          });
      }

      await poll_schema.findOneAndUpdate(
        {
          channelID,
        },
        {
          channelID,
          vote_options: new_votes,
          type,
        },
        {
          upsert: true,
        }
      );
      return interaction.reply({
        content: "Dodano kandydatów.",
        ephemeral: true,
      });
    }

    if (interaction.options.getSubcommand() === "list") {
      const votes = await poll_schema.findOne({ channelID });
      let options = [];

      if (votes) {
        const { vote_options } = votes;
        for (let counter = 0; counter < vote_options.length; ++counter) {
          options.push({
            name: counter,
            value: vote_options[counter],
            inline: true,
          });
        }
      } else {
        return interaction.reply({
          content: "Baza danych jest pusta.",
          ephemeral: true,
        });
      }
      console.log(options);
      const data = {
        title: "Voting list, zagłosuj używając **/vote [nr]**",
        color: interaction.member.displayColor,
        fields: options,
      };
      return interaction.reply({ embeds: [data] });
    }
    if (interaction.options.getSubcommand() === "count") {
      const counts = {};
      const db = await vote_schema.find({ channelID });
      let arr = [];
      db.forEach((voter) => arr.push(voter.voted));
      const poll = await poll_schema.findOne({ channelID });
      for (const num of arr) {
        counts[num] = counts[num] ? counts[num] + 1 : 1;
      }

      const maxKey = _.max(Object.keys(counts), (o) => counts[o]);
      console.log(counts);
      console.log(maxKey);
      console.log(poll.vote_options[maxKey]);
      const embed = new EmbedBuilder()
        .setColor(interaction.member.displayColor)
        .setDescription(`**[WYGRYWA](${poll.vote_options[maxKey]})**`)
        .setImage(poll.vote_options[maxKey]);

      return interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
    if (interaction.options.getSubcommand() === "delete") {
      const index = interaction.options.getString("erase");
      const old_votes = await poll_schema.findOne({ channelID });
      const newer = old_votes.vote_options;
      console.log(old_votes.vote_options);
      newer.splice(index, 1);
      console.log(newer);
      await poll_schema.findOneAndUpdate(
        {
          channelID,
        },
        {
          channelID,
          vote_options: newer,
        },
        {
          upsert: true,
        }
      );
      return interaction.reply({
        content: "Usunięto wpis.",
        ephemeral: true,
      });
    }
    if (interaction.options.getSubcommand() === "end") {
      await poll_schema.findOneAndDelete({
        channelID,
      });
      console.log("end");
      return interaction.reply({
        content: "Usunięto ankietę.",
        ephemeral: true,
      });
    }
  },
};
