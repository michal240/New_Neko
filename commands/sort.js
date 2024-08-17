import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("sort")
    .setDescription("art sorting")
    .addChannelOption((option) =>
      option
        .setName("character")
        .setDescription("What character is that.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const character = interaction.options.getChannel("character");
    const channel = await interaction.client.channels.fetch(
      interaction.channelId
    );
    await interaction.deferReply();
    const spicyness = channel.name;
    const threads = await character.threads.fetchActive();
    const threadArray = []; // Tworzymy pusty obiekt na wątki
    threads.threads.forEach((thread) => {
      threadArray[thread.name] = thread.id; // Dodajemy wątki do obiektu
    });

    const targetSpicyID = threadArray[spicyness];

    const targetSpicy = await interaction.client.channels.fetch(targetSpicyID);
    const filter = (m) => m.author.id === interaction.user.id;

    interaction.channel
      .awaitMessages({
        filter,
        max: 1,
        time: 30_000,
        errors: ["time"],
      })
      .then((collected) => {
        collected.first().attachments.forEach((attachment) => {
          targetSpicy.send(attachment.url);
        });
        interaction.editReply(
          `Art sent to ${character.name} with spicy level of ${spicyness}`
        );
      });
  },
};
