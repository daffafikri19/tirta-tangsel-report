import express from "express";
import { DB } from "./config.js";
import FlowmeterAirBakuRoute from "./routes/flowmeter_air_baku.js"
import PompaAirBakuRoute from "./routes/pompa_air_baku.js"
import FlowmeterAirFilterProduksiRoute from "./routes/flowmeter_air_filter_produksi.js"
import FlowmeterAirBackwashRoute from "./routes/flowmeter_air_backwash.js"
import FlowmeterAirReservoirRoute from "./routes/flowmeter_air_reservoir.js"
import ReservoirRoute from "./routes/reservoir.js"
import WaterTreatmentPlantRoute from "./routes/water_treatment_plant.js"
import FlowmeterAirFilterRoute from "./routes/flowmeter_air_filter.js"
import BackwashFilterPasirRoute from "./routes/backwash_filter_pasir.js"
import TangkiKoagulanPACRoute from "./routes/tangki_koagulan_pac.js"

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(FlowmeterAirBakuRoute);
app.use(PompaAirBakuRoute);
app.use(FlowmeterAirFilterProduksiRoute);
app.use(FlowmeterAirBackwashRoute);
app.use(FlowmeterAirReservoirRoute);
app.use(ReservoirRoute);
app.use(WaterTreatmentPlantRoute);
app.use(FlowmeterAirFilterRoute);
app.use(BackwashFilterPasirRoute);
app.use(TangkiKoagulanPACRoute);

async function startServer() {
  try {
    await DB.authenticate();
    console.log("Database connection has been established successfully.");

    await DB.sync({ alter: true, force: false }); // force true : Paksa & Reset database, digunakan jika terdapat kebutuhan mengganti model supaya sync
    console.log("Database synchronized.");

    app.listen(3000, () => {
      console.log(`Application running on http://localhost:3000`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startServer();
