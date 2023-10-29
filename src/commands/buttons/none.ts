import { ButtonInteraction } from "discord.js";
import { setWinnerTeam } from "../../utils.js";
import { Game } from "../../db/models.js";
import { GameModel } from "../../types.js";

const id = "none_button";
const execute = async (interaction: ButtonInteraction) => {
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

  await gameModelVerify?.update({
    isDone: true,
  });

  await interaction.update({
    content:
      interaction.message.content.replace("Quem ganhou?", "") +
      `**<@${interaction.user.id}> anuncia que o jogo foi cancelado e não houve vencedores.**`,
    components: [],
  });
};

export default { id, execute };
