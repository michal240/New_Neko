const fs = require("node:fs");
const path = require("node:path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord.js");
const clientId = "819251754334945295";
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
const rest = new REST({ version: "10" }).setToken(process.env.MAIN_TOKEN);

rest
  .put(Routes.applicationCommands(clientId), { body: commands })
  .then(() => console.log("Deployed globally."))
  .catch(console.error);
