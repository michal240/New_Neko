import fs from "node:fs";
import path from "node:path";
import { REST } from "@discordjs/rest";
import { Routes } from "discord.js";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const guildId = "701418375401701436";
const clientId = "876841202018824231";
const commands = [];

const commandsPath = path.join(__dirname, "./commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const { default: command } = await import(pathToFileURL(filePath));

  commands.push(command.data.toJSON());
}
commands.forEach((command) => {
  console.log(command.name);
});
const rest = new REST({ version: "10" }).setToken(process.env.TEST_TOKEN);

rest
  .put(Routes.applicationCommands(clientId, guildId), { body: commands })
  .then(() => console.log("Deployed."))
  .catch(console.error);
