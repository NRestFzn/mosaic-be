import "reflect-metadata";

import { Sequelize } from "sequelize-typescript";

import { env } from "./env.js";
import { models } from "../database/models/index.js";

export const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: "mysql",
  logging: env.NODE_ENV === "development" ? console.log : false,
  models
});
