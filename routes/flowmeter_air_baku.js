import express from "express"
import { fetchData, recordData } from "../controllers/flowmeter_air_baku.js";

const route = express.Router();

route.get('/api/record/flowmeter-air-baku/all', fetchData)
route.post('/api/record/flowmeter-air-baku', recordData)

export default route