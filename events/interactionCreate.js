module.exports = {
  name: "interactionCreate",
  execute(interaction) {
    console.log(
      `${interaction.user} in #${interaction.channel.name} triggered an interaction.`
    );
  },
};
