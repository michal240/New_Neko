import discord from "discord.js";
import dotenv from "dotenv";
import { response } from "./reaction_gifs.js";
import { total_members_counter } from "./counters.js";
dotenv.config();
const { GatewayIntentBits, Partials, Client, Collection } = discord;
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],

  partials: [Partials.Channel, Partials.Message],
});

client.commands = new Collection();
client.cooldowns = new Collection();
import eventHandler from "./handlers/event-handler.js";
import commandHandler from "./handlers/command-handler.js";
client.on("guildMemberAdd", async () => {
  await total_members_counter(client);
});
client.on("guildMemberRemove", async () => {
  await total_members_counter(client);
});
import { logger } from "./logger.js";
client.on("messageDelete", async (message) => {
  try {
    await logger(message, client);
  } catch (error) {
    console.log(error);
  }
});
// gifs
client.on("messageCreate", async (message) => {
  const prefix = "<-";
  try {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const author = message.author;
    const target = message.mentions.members.first();

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();
    const res = await response(cmd, author, target);
    message.channel.send({ embeds: [res] });
  } catch (err) {
    console.log(err);
    message.channel.send(err);
  }
});

client.on("channelCreate", async (channel) => {
  if (channel.guildId !== "1255165965776453795") return;

  console.log(channel);

  await channel.threads.create({
    name: "mild",
    reason: "mild",
  });
  await channel.threads.create({
    name: "spicy",
    reason: "spicy",
  });
  await channel.threads.create({
    name: "lvl 20 spicy",
    reason: "lvl 20 spicy",
  });
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isMessageContextMenuCommand()) {
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
  }

  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) return;
    // cooldown
    if (interaction.member.id !== "581425303625138187") {
      const { cooldowns } = client;

      if (!cooldowns.has(command.data.name)) {
        cooldowns.set(command.data.name, new Collection());
      }
      const now = Date.now();
      const timestamps = cooldowns.get(command.data.name);
      const defaultCooldownDuration = 3;
      const cooldownAmount =
        (command.cooldown ?? defaultCooldownDuration) * 1000;
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
  } else if (interaction.isAutocomplete()) {
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }
    try {
      await command.autocomplete(interaction);
    } catch (error) {
      console.error(error);
    }
  }
});

client.login(process.env.TEST_TOKEN).then(() => {
  eventHandler(client);
  commandHandler(client);
});
