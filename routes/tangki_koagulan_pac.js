import express from "express"
import { findAll, create } from "../controllers/tangki_koagulan_pac.js";

const route = express.Router();

route.get('/api/report/tangki-koagulan-pac/findAll', findAll)
route.post('/api/report/tangki-koagulan-pac/create', create)

export default route