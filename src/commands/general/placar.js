import { SlashCommandBuilder } from '@discordjs/builders'

const data = 
    new SlashCommandBuilder()
    .setName('placar')
    .setDescription('Crie uma partida personalizada');

    const execute = async (interaction) => {
        await interaction.reply('Pong!');
    };
    
    export default { data, execute };