import express from "express"
import { findAll, create } from "../controllers/backwash_filter_pasir.js";

const route = express.Router();

route.get('/api/report/backwash-filter-pasir/findAll', findAll)
route.post('/api/report/backwash-filter-pasir/create', create)

export default route