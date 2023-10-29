import { ButtonInteraction } from "discord.js";
import { setWinnerTeam } from "../../utils.js";

const id = "team2_button";
const execute = async (interaction: ButtonInteraction) => {
  await setWinnerTeam(interaction, false);
};

export default { id, execute };
