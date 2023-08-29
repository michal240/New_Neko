module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.info(`${client.user} gotowa do akcji!`);
  },
};
