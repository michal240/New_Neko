import { SlashCommandBuilder } from "discord.js";
import { downloadVideo, videoProgress } from "../upload.js";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("torrent")
    .setDescription("torrents")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("new")
        .setDescription("new torrent")
        .addStringOption((option) =>
          option.setName("magnet").setDescription("The user").setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("progress").setDescription("show progress")
    ),
  execute: async (interaction) => {
    const outputPath = path.join(__dirname, `../torrents/`);

    const magnetURL = interaction.options.getString("magnet");

    if (interaction.options.getSubcommand() === "new") {
      downloadVideo(magnetURL, outputPath);
      return interaction.reply("torrenting time");
    }
    if (interaction.options.getSubcommand() === "progress") {
      console.log(videoProgress());
      return interaction.reply("progress");
    }
  },
};
