import express from "express";
import { create, findAll } from "../controllers/pompa_air_baku.js";

const route = express.Router();

route.get('/api/report/pompa-air-baku/findAll', findAll)
route.post('/api/report/pompa-air-baku/create', create)

export default route