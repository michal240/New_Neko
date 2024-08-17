import config_schema from "./schema/config_schema.js";

async function fetch_guild() {
  let guilds = [];
  if (guilds.length === 0) {
    const config = await config_schema.find();
    config.forEach((guild) => {
      if (guild?.members_count) {
        guilds.push(guild);
      }
    });
  }
  return guilds;
}
async function total_members_counter(client) {
  const guilds = await fetch_guild();
  for (const guild of guilds) {
    const { serverID, members_count } = guild;

    try {
      let online = [];
      const server = await client.guilds.fetch(serverID);
      const members = await server.members.fetch();
      members.forEach((member) => {
        if (member.presence?.status) {
          online.push(member.presence.status);
        }
      });
      client.channels.cache
        .get(members_count)
        .edit({ name: `Ludziowie: ${server.memberCount}` });
    } catch (err) {
      console.log(err);
    }
  }
}
async function online_memmbers_counter(client) {
  const guilds = await fetch_guild();
  for (const guild of guilds) {
    const { serverID, online_count } = guild;

    try {
      let online = [];
      const server = await client.guilds.fetch(serverID);
      const previous = client.channels.cache
        .get(online_count)
        .name.match(/\d/g)
        .join("");
      console.log("previous", previous);
      const members = await server.members.fetch();
      members.forEach((member) => {
        if (member.presence?.status) {
          online.push(member.presence.status);
        }
      });
      console.log("now", online.length);
      if (previous !== online.length) {
        client.channels.cache
          .get(online_count)
          .edit({ name: `Ludziów online: ${online.length}` });
      }
    } catch (err) {
      console.log(err);
    }
  }
}
export { total_members_counter, online_memmbers_counter };
