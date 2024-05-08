import { Router } from "express";
import * as MC from "./message.controller.js";
import { auth } from "../../middleWares/auth.middleware.js";
import expressAsyncHandler from "express-async-handler";
import { validationMiddleware } from "../../middleWares/validation.middleware.js";
import { allMessagesSchema, addMessageSchema } from "./message-validation.js";

const router = Router();

router.post(
  "/",
  auth(),
  validationMiddleware(addMessageSchema),
  expressAsyncHandler(MC.addMessage)
);
router.post(
  "/getAllMessages",
  validationMiddleware(allMessagesSchema),
  auth(),
  expressAsyncHandler(MC.getAllMessages)
);

export default router;
