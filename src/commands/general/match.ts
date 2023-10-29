import { Game, Guild, Player, User } from "../../db/models.js";
import { GameModel, GuildModel, Member } from "../../types.js";
import { generateGroups, getChampions } from "../../utils.js";
import {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from "discord.js";

const data = new SlashCommandBuilder()
  .setName("match")
  .setDescription("Crie uma partida personalizada");

const execute = async (interaction: ChatInputCommandInteraction) => {
  const guildModel = await Guild.findOne({
    where: { id: interaction.guildId },
  });

  const guild = guildModel?.dataValues as GuildModel;

  if (!guild) {
    return interaction
      .reply({
        content: `Não existe uma role cadastrada, use o comando /conectar.`,
      })
      .then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      });
  }

  const gameModelVerify = await Game.findOne({
    where: {
      guildId: guild?.id,
      isDone: false,
    },
  });

  const hasGame = gameModelVerify?.dataValues as GameModel;

  if (hasGame) {
    return interaction
      .reply({
        content: `Já existe um jogo em andamento`,
      })
      .then((msg) => {
        setTimeout(() => msg.delete(), 3000);
      });
  }

  const role = interaction.guild?.roles.cache.get(guild.roleId);

  const members = role?.members?.map((e) => ({
    id: e.user.id,
    name: e.user.username,
  }));

  const [names1, names2] = generateGroups(members || []);

  const [champions1, champions2] = getChampions(
    names1.length,
    names2.length,
    3,
  );

  const gameModel = await Game.create({
    guildId: guild.id,
    isDone: false,
  });

  const game = gameModel?.dataValues as GameModel;

  members?.forEach(async (member) => {
    await User.findOrCreate({
      where: { id: member.id },
      defaults: {
        username: member.name,
        guildId: guild.id,
        score: 0,
      },
    });

    await Player.create({
      gameId: game.id,
      userId: member.id,
      score: 0,
      isBlueSide: Boolean(names1.find((name) => name.id === member.id)),
    });
  });

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

  return interaction.reply({
    content: `
            **Grupo 1:** ${names1.map((name) => name.name).join(" - ")}
**Champions:** \n${champions1.map((c) => `${c.icon} **${c.name}**`).join("\n")}
            **\nGrupo 2**: ${names2.map((name) => name.name).join(" - ")}
**Champions:** \n${champions2.map((c) => `${c.icon} **${c.name}**`).join("\n")}
\nQuem ganhou? \n`,
    components: [row],
  });
};

export default { data, execute };
