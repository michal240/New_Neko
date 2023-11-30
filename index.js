const discord = require("discord.js");
const { twitch_send, twitch_auth } = require("./twitch");
const dotenv = require("dotenv");
const CronJob = require("cron").CronJob;
const game_schema = require("./schema/game_schema");
dotenv.config();
const mongo = require("./mongo");
const { GatewayIntentBits, Partials, Client, Collection } = discord;
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],

  partials: [Partials.Channel, Partials.Message],
});

client.commands = new Collection();
client.cooldowns = new Collection();

const { eventHandler } = require("./handlers/event-handler");
const { commandHandler } = require("./handlers/command-handler");

client.on("ready", async () => {
  await mongo();
});

client.on("ready", async () => {
  const auth = new CronJob("0 1 30 */1 *", async function () {
    await twitch_auth();
  });

  auth.start();

  const job = new CronJob("*/1 * * * *", async function () {
    await twitch_send(client);
  });

  job.start();
});
const { logger } = require("./logger");
client.on("messageDelete", async (message) => {
  try {
    await logger(message, client);
  } catch (error) {
    console.log(error);
  }
});

client.on("messageCreate", async (message) => {
  const member = message.member;

  if (member.user.bot) return;
  if (await game_schema.findOne({ UserID: member.id })) return;
  await game_schema.findOneAndUpdate(
    { UserID: member.id },
    { UserID: member.id, wins: 0, losses: 0 },
    { upsert: true }
  );
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  if (interaction.member.id !== "581425303625138187") {
    const { cooldowns } = client;

    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const defaultCooldownDuration = 3;
    const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;
    if (timestamps.has(interaction.user.id)) {
      const expirationTime =
        timestamps.get(interaction.user.id) + cooldownAmount;

      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1000);
        return interaction.reply({
          content: `Poczekaj zanim użyjesz \`${command.data.name}\`. Możesz użyć ponownie <t:${expiredTimestamp}:R>.`,
          ephemeral: true,
        });
      }
    }
    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
  }

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

client.login(process.env.TEST_TOKEN).then(() => {
  eventHandler(client);
  commandHandler(client);
});
