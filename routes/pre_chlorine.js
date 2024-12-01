import express from "express";
import { create, findAll } from "../controllers/pre_chlorine.js";

const route = express.Router();

route.get('/api/report/pre-chlorine/findAll', findAll)
route.post('/api/report/pre-chlorine/create', create)

export default route