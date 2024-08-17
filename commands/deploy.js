import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import dotenv from "dotenv";
dotenv.config();
export default {
  data: new SlashCommandBuilder()
    .setName("deploy")
    .setDescription("Dodanie komend.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addBooleanOption((option) =>
      option
        .setName("global")
        .setDescription("Deploy globalny?")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (interaction.user.id !== "581425303625138187") {
      return interaction.reply("Tylko Uszaty może tego używać.");
    }
    const global = interaction.options.getBoolean("global");
    if (global === true) {
      import("../deploy-global.js");
    } else {
      import("../deploy.js");
    }

    return interaction.reply({ content: "Dodano komendy!", ephemeral: true });
  },
};
