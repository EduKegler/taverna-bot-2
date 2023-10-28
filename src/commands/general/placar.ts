import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("placar")
  .setDescription("Crie uma partida personalizada");

const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.reply("Pong!");
};

export default { data, execute };
