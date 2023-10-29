import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import { Guild, User } from "../../db/models.js";
import { GuildModel, UserModel } from "../../types.js";

const data = new SlashCommandBuilder()
  .setName("placar")
  .setDescription("Placar de resultados do servidor.");

const execute = async (interaction: ChatInputCommandInteraction) => {
  const guildModel = await Guild.findOne({
    where: { id: interaction.guildId },
  });

  const guild = guildModel?.dataValues as GuildModel;

  if (!guild) {
    return interaction.reply({
      content: `Não existe uma role cadastrada, use o comando /conectar.`,
    });
  }

  const usersModel = await User.findAll({
    where: {
      guildId: guild.id,
    },
  });

  const list = usersModel.map((user) => {
    const data = user.dataValues as UserModel;
    return { name: data.username, score: data.score };
  });

  const orderList = list
    .filter((d) => d.name !== "Total")
    .sort((a, b) => b.score - a.score);

  return interaction.reply({
    content: `
  Placar - Total de Jogos **${guild.totalGames}**\`\`\`${orderList
    .map((user) => `${user.name} - ${user.score}`)
    .join("\n")}\`\`\`
  `,
  });
};

export default { data, execute };
