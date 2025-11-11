import express, { Router } from "express";
import { deleteContactMsg, getAllContactMsg, getSingleContactMsg, submitContactForm, updateContactMsgStatus } from "../controllers/contact.controller.js";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const Contactrouter = express.Router();

Contactrouter.post("/submit-form", submitContactForm);


// Admin (no params)
Contactrouter.get("/get-all-contact-msg", auth , admin , getAllContactMsg);
Contactrouter.post("/get-single-contact-msg", auth , admin , getSingleContactMsg);
Contactrouter.patch("/update-contact-msg-status", auth , admin , updateContactMsgStatus);
Contactrouter.delete("/delete-contact-msg", auth , admin , deleteContactMsg);

export default Contactrouter;
