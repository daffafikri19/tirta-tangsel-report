import express from "express";
import { DB } from "./config.js";
import FlowmeterAirBakuRoute from "./routes/flowmeter_air_baku.js"

const app = express();

app.use(express.json());
app.use(FlowmeterAirBakuRoute);

async function startServer() {
  try {
    await DB.authenticate();
    console.log("Database connection has been established successfully.");

    await DB.sync({ alter: true });
    console.log("Database synchronized.");

    app.listen(3000, () => {
      console.log(`Application running on http://localhost:3000`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startServer();
