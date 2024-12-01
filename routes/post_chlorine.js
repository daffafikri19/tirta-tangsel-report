import express from "express";
import { create, findAll } from "../controllers/post_chlorine.js";

const route = express.Router();

route.get('/api/report/post-chlorine/findAll', findAll)
route.post('/api/report/post-chlorine/create', create)

export default route