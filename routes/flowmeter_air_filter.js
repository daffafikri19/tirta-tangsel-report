import express from "express"
import { findAll, create } from "../controllers/flowmeter_air_filter.js";

const route = express.Router();

route.get('/api/report/flowmeter-air-filter/findAll', findAll)
route.post('/api/report/flowmeter-air-filter/create', create)

export default route