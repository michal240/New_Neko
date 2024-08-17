import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
export default {
  data: new SlashCommandBuilder().setName("auth").setDescription("auth"),
  async execute(interaction) {
    if (interaction.user.id !== "581425303625138187") {
      return interaction.reply("Tylko Uszaty może tego używać.");
    }
    await import("../googleAUTH.js");

    return interaction.reply("AUTH");
  },
};
