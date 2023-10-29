import Sequelize from "sequelize";
import { sequelize } from "./connect.js";

export const Guild = sequelize.define("guilds", {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  totalGames: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  roleId: {
    type: Sequelize.STRING,
  },
  roleName: {
    type: Sequelize.STRING,
  },
});

export const User = sequelize.define("users", {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING,
  },
  score: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  guildId: {
    type: Sequelize.STRING,
    references: {
      model: "guilds",
      key: "id",
    },
  },
});

export const Player = sequelize.define("players", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  gameId: {
    type: Sequelize.INTEGER,
    references: {
      model: "games",
      key: "id",
    },
  },
  userId: {
    type: Sequelize.STRING,
    references: {
      model: "users",
      key: "id",
    },
  },
  isBlueSide: Sequelize.BOOLEAN,
});

export const Game = sequelize.define("games", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  isDone: {
    type: Sequelize.BOOLEAN,
  },
  guildId: {
    type: Sequelize.STRING,
    references: {
      model: "guilds",
      key: "id",
    },
  },
});
