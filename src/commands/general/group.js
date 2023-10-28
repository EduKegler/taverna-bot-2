import { generateGroups, getChampions } from '../../utils.js'
import { ButtonBuilder, ButtonStyle, ActionRowBuilder, SlashCommandBuilder } from 'discord.js'

const data = 
    new SlashCommandBuilder()
    .setName('group')
    .setDescription('Crie uma partida personalizada');


const execute = async (interaction) => {
    let currentGame = undefined
    const [names1, names2] = generateGroups();
    const [champions1, champions2] = getChampions();

    currentGame = {
        team1: names1.map((user) => user.name),
        team2: names2.map((user) => user.name),
    };

    const confirm = new ButtonBuilder()
    .setCustomId('confirm')
    .setLabel('Confirm Ban')
    .setStyle(ButtonStyle.Danger);

    const cancel = new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder()
        .addComponents(cancel, confirm);
    
    interaction.reply({
        content: `
            **Grupo 1:** ${names1.map((name) => name.id).join(" - ")}
            **Champions:** \n${champions1.map((c) => `${c.icon} **${c.name}**`).join("\n")}
            **\nGrupo 2**: ${names2.map((name) => name.id).join(" - ")}
            **Champions:** \n${champions2.map((c) => `${c.icon} **${c.name}**`).join("\n")}
            Quem ganhou? \n`,  components: [row],
    })
};

export default { data, execute };