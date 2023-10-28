import { Client, GatewayIntentBits, Collection } from 'discord.js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config()

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] }) 

const TOKEN = process.env.TAVERNA_BOT_TOKEN

client.login(TOKEN)

client.on('ready', () => {
    console.log(`${client.user.tag} acabou de entrar.`)
})

client.on('messageCreate', (message) => {
    console.log(`${message.content}`)
})

client.commands = new Collection();

const registerCommands = async () => {
    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);
    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = await import(`./commands/${folder}/${file}`);
            if ('data' in command.default && 'execute' in command.default) {
                console.log(`Added ${command.default.data.name} command.`);
                client.commands.set(command.default.data.name, command.default);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

registerCommands()

// client.on('interactionCreate', async (interaction) => {
//     
// })

// const main = async () => {
//     const commands = [group, placar]

//     try {
//         console.log('Started refreshing application (/) commands.');
//         await rest.put(Routes.applicationCommands(CLIENT_ID, GUILD_ID), { body: commands });
//         console.log('Successfully reloaded application (/) commands.');
//     } catch (error) {
//         console.log(error)
//     } 

    
// }

// main();