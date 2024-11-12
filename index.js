import express from "express";
import { DB } from "./config.js";
import FlowmeterAirBakuRoute from "./routes/flowmeter_air_baku.js"
import PompaAirBakuRoute from "./routes/pompa_air_baku.js"
import FlowmeterAirFilterRoute from "./routes/flowmeter_air_filter.js"
import FlowmeterAirBackwashRoute from "./routes/flowmeter_air_backwash.js"
import FlowmeterAirReservoirRoute from "./routes/flowmeter_air_reservoir.js"
import ReservoirRoute from "./routes/reservoir.js"
import WaterTreatmentPlantRoute from "./routes/water_treatment_plant.js"

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(FlowmeterAirBakuRoute);
app.use(PompaAirBakuRoute);
app.use(FlowmeterAirFilterRoute);
app.use(FlowmeterAirBackwashRoute);
app.use(FlowmeterAirReservoirRoute);
app.use(ReservoirRoute);
app.use(WaterTreatmentPlantRoute);

async function startServer() {
  try {
    await DB.authenticate();
    console.log("Database connection has been established successfully.");

    await DB.sync({ alter: true, force: true }); // force true : Paksa & Reset database, digunakan jika terdapat kebutuhan mengganti model supaya sync
    console.log("Database synchronized.");

    app.listen(3000, () => {
      console.log(`Application running on http://localhost:3000`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startServer();
