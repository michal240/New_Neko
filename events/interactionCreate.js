export default {
  name: "interactionCreate",
  execute(interaction) {
    console.log(
      `${interaction.user.username} in #${interaction.channel.name} triggered ${interaction.commandName}.`
    );
  },
};
