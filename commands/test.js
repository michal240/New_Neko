import { SlashCommandBuilder } from "discord.js";
export default {
  data: new SlashCommandBuilder().setName("test").setDescription("test"),
  async execute(interaction) {
    if (interaction.user.id !== "581425303625138187") {
      return interaction.reply("Tylko Uszaty może tego używać.");
    }
    console.log(interaction.message);
    return interaction.reply("testing");
  },
};
