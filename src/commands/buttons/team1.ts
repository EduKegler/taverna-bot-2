import { ButtonInteraction } from "discord.js";
import { setWinnerTeam } from "../../utils.js";

const id = "team1_button";
const execute = async (interaction: ButtonInteraction) => {
  await setWinnerTeam(interaction, true);
};

export default { id, execute };
