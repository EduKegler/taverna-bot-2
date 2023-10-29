import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import { Guild } from "../../db/models.js";

const data = new SlashCommandBuilder()
  .setName("conectar")
  .setDescription("Conecte seu servidor")
  .addRoleOption((option) =>
    option
      .setName("role")
      .setDescription("Selecione uma role para definir os jogadores")
      .setRequired(true),
  );

const execute = async (interaction: ChatInputCommandInteraction) => {
  const role = interaction.options.get("role")?.role;
  const guild = interaction.guild;
  try {
    await Guild.upsert({
      id: guild?.id,
      name: guild?.name,
      totalGames: 0,
      roleId: role?.id,
      roleName: role?.name,
    });
  } catch (error) {
    console.log(error);
  }
  await interaction.reply({
    content: `Servidor ${guild?.name} esta conectado ao bot usando a role <@&${role?.id}>`,
  });
};

export default { data, execute };
