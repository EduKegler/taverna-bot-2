import { ButtonInteraction } from "discord.js";
import { champions } from "./assets.js";
import { GameModel, GuildModel, Member, PlayersModel } from "./types.js";
import { Game, Guild, Player, User } from "./db/models.js";
import { Sequelize } from "sequelize";

function shuffleArray<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateGroups(members: Member[]): [Member[], Member[]] {
  const newNames = shuffleArray(members);
  const midIndex = Math.floor(newNames.length / 2);
  return [newNames.slice(0, midIndex), newNames.slice(midIndex)];
}

export function getChampions(
  team1: number,
  team2: number,
  championsAmount: number,
) {
  const championList = shuffleArray(champions);
  return [
    championList.slice(0, team1 * championsAmount),
    championList.slice(
      team1 * championsAmount,
      team1 * championsAmount + team2 * championsAmount,
    ),
  ];
}

export const setWinnerTeam = async (
  interaction: ButtonInteraction,
  isBlueSide: boolean,
) => {
  const guildModel = await Guild.findOne({
    where: { id: interaction.guildId },
  });

  const gameModelVerify = await Game.findOne({
    where: {
      guildId: interaction.guildId,
      isDone: false,
    },
  });

  const game = gameModelVerify?.dataValues as GameModel;

  if (!game) {
    return interaction.reply({
      content: `Não existe jogo em andamento`,
    });
  }

  const playesModel = await Player.findAll({
    where: {
      gameId: game.id,
    },
  });

  const players = playesModel
    .map((user) => {
      return user.dataValues as PlayersModel;
    })
    .filter((p) => p.isBlueSide === isBlueSide);

  players.forEach(async (player) => {
    await User.update(
      {
        score: Sequelize.literal("score + 1"),
      },
      {
        where: { id: player.userId },
      },
    );
  });

  await gameModelVerify?.update({
    isDone: true,
  });

  await guildModel?.update({
    total_games: Sequelize.literal("total_games + 1"),
  });

  await interaction.update({
    content:
      interaction.message.content.replace("Quem ganhou?", "") +
      `**<@${interaction.user.id}> anuncia que o time ${
        isBlueSide ? "1" : "2"
      } saiu vitorioso.**`,
    components: [],
  });
};
