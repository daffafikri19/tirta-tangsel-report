import express from "express";
import { create, findAll } from "../controllers/pompa_dosing_pac.js";

const route = express.Router();

route.get('/api/report/pompa-dosing-pac/findAll', findAll)
route.post('/api/report/pompa-dosing-pac/create', create)

export default route