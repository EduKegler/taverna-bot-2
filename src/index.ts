import {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
} from "discord.js";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { ClientWithCommands } from "./types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
}) as ClientWithCommands;

const TOKEN = process.env.TAVERNA_BOT_TOKEN || "";

client.login(TOKEN);

client["commands"] = new Collection();

const rest = new REST().setToken(TOKEN);

const registerCommands = async () => {
  const commands = [];
  const foldersPath = path.join(__dirname, "commands");
  const commandFolders = fs.readdirSync(foldersPath);
  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".ts"));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = await import(`./commands/${folder}/${file}`);
      if (
        ("data" in command.default || "id" in command.default) &&
        "execute" in command.default
      ) {
        if ("data" in command.default) {
          console.log(`Added ${command.default.data.name} command.`);
          client.commands.set(command.default.data.name, command.default);
          commands.push(command.default.data.toJSON());
        } else {
          console.log(`Added ${command.default.id} button.`);
          client.commands.set(command.default.id, command.default);
        }
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
        );
      }
    }
  }

  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );
    const data = (await rest.put(
      Routes.applicationGuildCommands(
        process.env.TAVERNA_CLIENT_ID || "",
        process.env.TAVERNA_SERVER_ID || "",
      ),
      { body: commands },
    )) as unknown[];
    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
};

const registerEvents = async () => {
  const eventsPath = path.join(__dirname, "events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".ts"));

  for (const file of eventFiles) {
    const event = await import(`./events/${file}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
};

registerCommands();
registerEvents();
