import { Router } from "express";
import * as CC from "./chat.controller.js";
import { auth } from "../../middleWares/auth.middleware.js";
import { validationMiddleware } from "../../middleWares/validation.middleware.js";
import { addOrFetchChatSchema } from "./chat-validation.js";

const router = Router();

router.post(
  "/",
  auth(),
  validationMiddleware(addOrFetchChatSchema),
  CC.addOrFetchChat
);
router.get("/", auth(), CC.getAllChats);

export default router;
