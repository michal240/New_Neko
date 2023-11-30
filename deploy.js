const fs = require("node:fs");
const path = require("node:path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord.js");
const guildId = "701418375401701436";
const clientId = "876841202018824231";
const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
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
