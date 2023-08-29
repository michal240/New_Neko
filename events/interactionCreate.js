module.exports = {
  name: "interactionCreate",
  execute(interaction) {
    console.log(
      `${interaction.user.name} in #${interaction.channel.name} triggered an interaction.`
    );
  },
};
