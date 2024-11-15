import express from "express"
import { findAll, create } from "../controllers/flowmeter_air_filter_produksi.js";

const route = express.Router();

route.get('/api/report/flowmeter-air-filter-produksi/findAll', findAll)
route.post('/api/report/flowmeter-air-filter-produksi/create', create)

export default route