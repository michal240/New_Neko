const { SlashCommandBuilder } = require("discord.js");
module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder().setName("test").setDescription("test"),
  async execute(interaction) {
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
          .then((collected) => {
            const e = collected.map((element) => {
              return element;
            });
            interaction.channel.messages.delete(e[0].id);
            let text = "";

            const content = e[0].content.split(", ");
            for (let counter = 0; counter < content.length; ++counter) {
              text += `**${counter + 1}**: ${content[counter]} \n`;
            }
            interaction.followUp({ content: text, ephemeral: true });
          })
          .catch((collected) => {
            console.log(collected);
            interaction.followUp("Looks like nobody got the answer this time.");
          });
      });
  },
};
