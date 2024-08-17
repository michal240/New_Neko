import { twitch_send, twitch_auth } from "../twitch.js";
import { CronJob } from "cron";

import { online_memmbers_counter } from "../counters.js";
import { gifs_fetch } from "../reaction_gifs.js";

import mongo from "../mongo.js";
export default {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`${client.user.username} gotowa do akcji!`);
    await mongo();
    await gifs_fetch();
    await import("../googleAUTH.js");

    const auth = new CronJob("0 1 30 */1 *", async function () {
      await twitch_auth();
    });

    auth.start();

    const job = new CronJob("*/5 * * * *", async function () {
      await twitch_send(client);
    });
    const counter = new CronJob("0 */1 * * *", async function () {
      await online_memmbers_counter(client);
    });
    job.start();
    counter.start();
  },
};
