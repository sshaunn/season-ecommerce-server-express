import "reflect-metadata";
import { DataSource } from "typeorm";

export const dataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "sp100809",
  database: "seasonDevDB",
  synchronize: false,
  logging: ["query", "error"],
  entities: ["src/api/model/entity/**/*.entity.{ts,js}"],
  migrations: ["src/api/model/migration/**/*.{ts,js}"],
  subscribers: ["src/api/model/subscriber/**/*.{ts,js}"],
});
