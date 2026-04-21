import express from 'express';
import { getProfiles } from "../controllers/profile.controller.js";

const Router = express.Router();

Router.get("/", getProfiles);

export default Router;
