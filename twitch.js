const CLIENT_ID = "3hlgjasvwc9svz2vipvyzah08l8ur3";
const fetch = require("node-fetch");
const live_schema = require("./schema/live_schema");

async function twitch_streamers() {
  let lives = [];
  let paths = [];
  let names = [];
  const streamers = await live_schema.find();

  for (let counter = 0; counter < streamers.length; ++counter) {
    const { url } = streamers[counter];
    lives.push(url);
  }
  lives.forEach((url) => paths.push(new URL(url).pathname));
  paths.forEach((path) => names.push(path.slice(1)));

  return names;
}

async function twitch_check(username) {
  const theUrl = `https://api.twitch.tv/helix/streams?user_login=${username}`;

  const response = await fetch(theUrl, {
    method: "GET",
    headers: {
      "Client-Id": CLIENT_ID,
      Authorization: "Bearer c8hjso3x2g02t6ywa59gxlandwp1h6",
    },
  });
  const data = await response.json();
  if (data.data?.length) {
    return `https://www.twitch.tv/${username}`;
  }
}

module.exports = { twitch_check, twitch_streamers };
