import express from "express";
import { subscribeNewsletter } from "../controllers/newsletter.controller.js";

const subscribeNewsletterRouter = express.Router();

subscribeNewsletterRouter.post("/subscribe", subscribeNewsletter);

export default subscribeNewsletterRouter;
