import { DataSource } from "typeorm";
import { DiagnosticMetric } from "./entities/diagnostic-metric";
import config from "./config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.POSTGRES_HOST,
  port: 5432,
  username: config.POSTGRES_USER,
  password: config.POSTGRES_PASSWORD,
  database: config.POSTGRES_DB,
  synchronize: true,
  entities: [DiagnosticMetric],
});
