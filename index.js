import express from "express";
import path from "path";
import { DB } from "./config.js";
import FlowmeterAirBakuRoute from "./routes/flowmeter_air_baku.js"
import PompaAirBakuRoute from "./routes/pompa_air_baku.js"
import FlowmeterAirFilterProduksiRoute from "./routes/flowmeter_air_filter_produksi.js"
import FlowmeterAirBackwashRoute from "./routes/flowmeter_air_backwash.js"
import FlowmeterAirReservoirRoute from "./routes/flowmeter_air_reservoir.js"
import ReservoirRoute from "./routes/reservoir.js"
import PompaAirDistribusiRoute from "./routes/pompa_air_distribusi.js";
import WaterTreatmentPlantRoute from "./routes/water_treatment_plant.js"
import BackwashFilterPasirRoute from "./routes/backwash_filter_pasir.js"
import TangkiKoagulanPACRoute from "./routes/tangki_koagulan_pac.js"
import PompaDosingPACRoute from "./routes/pompa_dosing_pac.js"
import PompaDosingSodaRoute from "./routes/pompa_dosing_soda.js"
import PreChlorineRoute from "./routes/pre_chlorine.js"
import PostChlorineRoute from "./routes/post_chlorine.js"
import TangkiChlorineRoute from "./routes/tangki_chlorine.js"

import generateTimestamp from "./lib/timestamp.js";

const app = express();

app.use(express.static(path.resolve("view")));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(FlowmeterAirBakuRoute);
app.use(PompaAirBakuRoute);
app.use(FlowmeterAirFilterProduksiRoute);
app.use(FlowmeterAirBackwashRoute);
app.use(FlowmeterAirReservoirRoute);
app.use(ReservoirRoute);
app.use(PompaAirDistribusiRoute);
app.use(WaterTreatmentPlantRoute);
app.use(BackwashFilterPasirRoute);
app.use(TangkiKoagulanPACRoute);
app.use(PompaDosingPACRoute);
app.use(PompaDosingSodaRoute);
app.use(PreChlorineRoute);
app.use(PostChlorineRoute);
app.use(TangkiChlorineRoute);

app.get("/api/timestamp", (req, res) => {
  const timestamp = generateTimestamp();
  res.json({ timestamp: timestamp });
});

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
