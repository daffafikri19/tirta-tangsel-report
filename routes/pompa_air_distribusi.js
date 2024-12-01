import express from "express";
import { create, findAll } from "../controllers/pompa_air_distribusi.js";

const route = express.Router();

route.get('/api/report/pompa-air-distribusi/findAll', findAll)
route.post('/api/report/pompa-air-distribusi/create', create)

export default route