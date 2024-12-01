import express from "express";
import { create, findAll } from "../controllers/tangki_chlorine.js";

const route = express.Router();

route.get('/api/report/tangki-chlorine/findAll', findAll)
route.post('/api/report/tangki-chlorine/create', create)

export default route