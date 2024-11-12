import express from "express"
import { findAll, create } from "../controllers/flowmeter_air_baku.js";

const route = express.Router();

route.get('/api/report/flowmeter-air-baku/findAll', findAll)
route.post('/api/report/flowmeter-air-baku/create', create)

export default route