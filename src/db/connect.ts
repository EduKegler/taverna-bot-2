import { config } from "dotenv";

import { Sequelize } from "sequelize";

config();

const { PGUSER, PGHOST, PGPASSWORD, PGDATABASE } = process.env;

export const sequelize = new Sequelize(
  PGDATABASE || "",
  PGUSER || "",
  PGPASSWORD,
  {
    host: PGHOST,
    dialect: "postgres",
    dialectOptions: {
      ssl: true,
    },
  },
);
