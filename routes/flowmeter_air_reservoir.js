import express from "express"
import { findAll, create } from "../controllers/flowmeter_air_reservoir.js";

const route = express.Router();

route.get('/api/report/flowmeter-air-reservoir/findAll', findAll)
route.post('/api/report/flowmeter-air-reservoir/create', create)

export default route