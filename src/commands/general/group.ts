import { generateGroups, getChampions } from "../../utils.js";
import {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  SlashCommandBuilder,
  Interaction,
  CacheType,
  ChatInputCommandInteraction,
} from "discord.js";

const data = new SlashCommandBuilder()
  .setName("group")
  .setDescription("Crie uma partida personalizada");

const execute = async (interaction: ChatInputCommandInteraction) => {
  const [names1, names2] = generateGroups();
  const [champions1, champions2] = getChampions();

  const team1 = new ButtonBuilder()
    .setCustomId("team1_button")
    .setLabel("Primeiro Time")
    .setStyle(ButtonStyle.Primary);

  const team2 = new ButtonBuilder()
    .setCustomId("team2_button")
    .setLabel("Segundo Time")
    .setStyle(ButtonStyle.Danger);

  const none = new ButtonBuilder()
    .setCustomId("none_button")
    .setLabel("Cancelar")
    .setStyle(ButtonStyle.Secondary);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    team1,
    team2,
    none,
  );

  interaction.reply({
    content: `
            **Grupo 1:** ${names1.map((name) => name.id).join(" - ")}
            **Champions:** \n${champions1
              .map((c) => `${c.icon} **${c.name}**`)
              .join("\n")}
            **\nGrupo 2**: ${names2.map((name) => name.id).join(" - ")}
            **Champions:** \n${champions2
              .map((c) => `${c.icon} **${c.name}**`)
              .join("\n")}
            Quem ganhou? \n`,
    components: [row],
  });
};

export default { data, execute };
