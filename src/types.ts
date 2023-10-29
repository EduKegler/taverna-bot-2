import { Client, Collection } from "discord.js";

export interface ClientWithCommands extends Client {
  commands: Collection<string, any>;
}

export interface GuildModel {
  id: string;
  name: string;
  totalGames: string;
  roleId: string;
  roleName: string;
}

export interface GameModel {
  id: number;
  isDone: boolean;
}

export interface UserModel {
  id: string;
  username: string;
  score: number;
  guildId: number;
}

export interface PlayersModel {
  id: number;
  gameId: string;
  userId: string;
  isBlueSide: boolean;
}

export interface Member {
  id: string;
  name: string;
}
