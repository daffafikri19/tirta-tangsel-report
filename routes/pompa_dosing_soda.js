import express from "express";
import { create, findAll } from "../controllers/pompa_dosing_soda.js";

const route = express.Router();

route.get('/api/report/pompa-dosing-soda/findAll', findAll)
route.post('/api/report/pompa-dosing-soda/create', create)

export default route