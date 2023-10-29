import { Client, Events } from "discord.js";
import { User, Game, Guild, Player } from "../db/models.js";

const name = Events.ClientReady;
const once = true;
const execute = async (client: Client) => {
  await Guild.sync();
  await Game.sync();
  await User.sync();
  await Player.sync();
  console.log(`${client.user?.tag} acabou de entrar.`);
};

export { name, once, execute };
