import dotenv from "dotenv";

dotenv.config();

const config = {
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_DB: process.env.POSTGRES_DB,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 4000,
};
console.log(config);

export default config;
