import express from "express";
import cors from "cors";
import getResultsRouter from "./get-results-module/get-results.controller";
import { initializeDataSource } from "./initialize-data-source";
import config from "./config";

const app = express();

app.use(express.json());
app.use(cors());
app.use(getResultsRouter);

async function main() {
  try {
    await initializeDataSource();
    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

main();
