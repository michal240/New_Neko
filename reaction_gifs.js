import gif_types_schema from "./schema/gif_types_schema.js";
import gif_random from "./gif-random.js";

let type;
async function gifs_fetch() {
  if (type) {
    return type;
  }
  const gifs = await gif_types_schema.find();
  console.log("fetched");

  return (type = [...gifs]);
}
async function add(name, type, desc) {
  await gif_types_schema.findOneAndUpdate(
    {
      name,
    },
    {
      type,
      desc,
    },
    {
      upsert: true,
    }
  );
}

async function response(name, author, target) {
  const found = type.find((element) => element.name === name);
  console.log(found);
  if (!found) {
    throw `**${name} not found**`;
  }
  return await gif_random(found.type, author, target);
}

export { gifs_fetch, add, response };
