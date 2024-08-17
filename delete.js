export default function DeleteCommand(commandID) {
  const { REST } = require("@discordjs/rest");
  const { Routes } = require("discord.js");
  const clientId = "819251754334945295";

  const rest = new REST({ version: "10" }).setToken(process.env.MAIN_TOKEN);

  rest
    .delete(Routes.applicationCommand(clientId, commandID))
    .then(() => console.log("Successfully deleted application command"))
    .catch(console.error);
}
