const CLIENT_ID = "3hlgjasvwc9svz2vipvyzah08l8ur3";
const fetch = require("node-fetch");
const live_schema = require("./schema/live_schema");
const auth_schema = require("./schema/twitch_auth_schema");
const moment = require("moment");
async function twitch_auth() {
  const theUrl = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=maexnwlf3pmsds01s1scbhyi6zyy33&grant_type=client_credentials`;

  const response = await fetch(theUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const data = await response.json();
  console.log(data.access_token);
  await auth_schema.findOneAndUpdate(
    { CLIENT_ID },
    { CLIENT_ID, auth_token: data.access_token },
    { upsert: true }
  );
}
async function twitch_check(username) {
  const auth = await auth_schema.findOne({ CLIENT_ID });
  const theUrl = `https://api.twitch.tv/helix/streams?user_login=${username}`;

  const response = await fetch(theUrl, {
    method: "GET",
    headers: {
      "Client-Id": CLIENT_ID,
      Authorization: `Bearer ${auth.auth_token}`,
    },
  });
  const data = await response.json();

  if (data.data?.length) {
    const user = data.data[0];
    const { user_name, user_login, started_at } = user;
    return { user_name, user_login, started_at };
  }
}

async function twitch_send(client) {
  const interval = 36000000;

  const streamers = await live_schema.find();
  for (const streamer of streamers) {
    const { name, stream_channel } = streamer;
    const channel = client.channels.cache.get(stream_channel);
    const content = await twitch_check(name);

    if (content) {
      console.log(content);
      const { user_name, user_login, started_at } = content;
      const time = moment(started_at).format("X");
      const db = await live_schema.findOne({ name: user_login });
      const las_live = moment().valueOf() - moment(db.updatedAt).valueOf();
      console.log(las_live);
      if (!db.updatedAt) {
        await live_schema.findOneAndUpdate(
          { name: user_login },
          { timestamps: true }
        );
        channel.send(
          `[${user_name}](https://www.twitch.tv/${user_login}) zaczął/zaczęła streamować <t:${time}:R>`
        );
        console.log("1");
      } else if (las_live > interval) {
        channel.send(
          `[${user_name}](https://www.twitch.tv/${user_login}) zaczął/zaczęła streamować <t:${time}:R>`
        );
        console.log("2");

        await live_schema.findOneAndUpdate(
          { name: user_login },
          { timestamps: true }
        );
      }
    }
  }
}

module.exports = { twitch_check, twitch_send, twitch_auth };
