import { Client, GatewayIntentBits,Routes } from 'discord.js'
import { config } from 'dotenv'

import { REST } from '@discordjs/rest'

config()

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] }) 

const TOKEN = process.env.TAVERNA_BOT_TOKEN
const CLIENT_ID = process.env.TAVERNA_CLIENT_ID
const GUILD_ID = process.env.TAVERNA_SERVER_ID

const rest = new REST({ version:'10' }).setToken(TOKEN)

client.login(TOKEN)

client.on('ready', () => {
    console.log(`${client.user.tag} acabou de entrar.`)
})

client.on('messageCreate', (message) => {
    console.log(`${message.content}`)
})

client.on('interactionCreate', async (interaction) => {
    if(interaction.isChatInputCommand()){
        console.log('Hello world')
        try { 
        console.log('0')
        const a = await interaction.reply({ content: 'test' });
    } catch(err) {
        console.log("errr", err, JSON.stringify(err.requestBody.json))
    }

    }
})

const main = async () => {
    const commands = [
        {
          name: 'ping',
          description: 'Replies with Pong!',
        },
        {
            name: 'help',
            description: 'Help!',
        },
      ];

    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(CLIENT_ID, GUILD_ID), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.log(error)
    } 
}

main();