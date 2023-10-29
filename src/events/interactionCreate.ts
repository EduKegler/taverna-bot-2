import { Events, Interaction } from "discord.js";
import { ClientWithCommands } from "../types.js";

const name = Events.InteractionCreate;
const once = false;
const execute = async (interaction: Interaction) => {
  const isButton = interaction.isButton();
  if (interaction.isChatInputCommand() || isButton) {
    const commandId = isButton ? interaction.customId : interaction.commandName;
    const command = (interaction.client as ClientWithCommands).commands.get(
      commandId,
    );
    if (!command) {
      console.error(`No command matching ${commandId} was found.`);
      return;
    }
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  }
};

export { name, once, execute };
