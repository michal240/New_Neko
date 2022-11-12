const discord = require("discord.js");
const dotenv = require("dotenv");
const mongo = require("./mongo");
dotenv.config();
const { GatewayIntentBits, Partials } = discord;
const client = new discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],

  partials: [Partials.Channel, Partials.Message],
});

client.commands = new discord.Collection();

const { eventHandler } = require("./handlers/event-handler");
const { commandHandler } = require("./handlers/command-handler");

client.on("ready", async () => {
 // require("./deploy-commands");
  await mongo();
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "Pojawił się jakiś błąd z komendą.",
      ephemeral: true,
    });
  }
});


client.login(process.env.MAIN_TOKEN).then(() => {
  eventHandler(client);
  commandHandler(client);
});
