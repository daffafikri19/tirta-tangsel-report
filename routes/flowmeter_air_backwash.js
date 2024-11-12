import express from "express"
import { findAll, create } from "../controllers/flowmeter_air_backwash.js";

const route = express.Router();

route.get('/api/report/flowmeter-air-backwash/findAll', findAll)
route.post('/api/report/flowmeter-air-backwash/create', create)

export default route