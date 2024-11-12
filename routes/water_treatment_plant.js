import express from "express";
import { findAll, create } from "../controllers/water_treatment_plant.js";

const route = express.Router();

route.get('/api/report/water-treatment-plant/findAll', findAll)
route.post('/api/report/water-treatment-plant/create', create)

export default route