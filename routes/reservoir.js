import express from "express";
import { findAll, create } from "../controllers/reservoir.js";

const route = express.Router();

route.get('/api/report/reservoir/findAll', findAll)
route.post('/api/report/reservoir/create', create)

export default route