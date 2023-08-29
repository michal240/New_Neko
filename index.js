const discord = require("discord.js");
const { twitch_streamers, twitch_check } = require("./twitch");
const live_schema = require("./schema/live_schema");
const dotenv = require("dotenv");
const CronJob = require("cron").CronJob;
dotenv.config();
const mongo = require("./mongo");
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
  await mongo();
});
client.on("ready", async () => {
  const interval = 36000000;

  const channel = client.channels.cache.get("845643327209865236");

  const job = new CronJob("*/5 * * * *", async function () {
    const streamers = await twitch_streamers();
    console.log(streamers);
    for (const streamer of streamers) {
      const content = await twitch_check(streamer);
      if (content) {
        const online = await live_schema.findOne({ url: content });

        const las_live = Date.now() - online.updatedAt;
        if (!online.updatedAt) {
          channel.send(`${content}`);

          await live_schema.findOneAndUpdate(
            { url: content },
            { timestamps: true }
          );
        } else if (las_live > interval) {
          channel.send(`${content}`);
          await live_schema.findOneAndUpdate(
            { url: content },
            { timestamps: true }
          );
        }
      }
    }
  });
  job.start();
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

client.login(process.env.TEST_TOKEN).then(() => {
  eventHandler(client);
  commandHandler(client);
});
