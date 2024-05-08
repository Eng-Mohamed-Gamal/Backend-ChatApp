import { Router } from "express";
import { multerMiddleHost } from "../../middleWares/multer.js";
import expressAsyncHandler from "express-async-handler";

import * as UC from "./user.controller.js";
import { allowedExtensions } from "../../utils/allowed-extensions.js";
import { auth } from "../../middleWares/auth.middleware.js";
import { validationMiddleware } from "../../middleWares/validation.middleware.js";
import { getUsersSchema, logInSchema, signUpSchema, updateUserSchema } from "./user-validation.js";

const router = Router();

router.post(
  "/",
  multerMiddleHost({ extensions: allowedExtensions.image }).single("profile"),
  validationMiddleware(signUpSchema),
  expressAsyncHandler(UC.signUp)
);

router.post(
  "/logIn",
  validationMiddleware(logInSchema),
  expressAsyncHandler(UC.logIn)
);

router.put("/", auth(),  validationMiddleware(updateUserSchema)  ,expressAsyncHandler(UC.updateUser));

router.post(
  "/uploadProfilePic",
  auth(),
  multerMiddleHost({ extensions: allowedExtensions.image }).single("profile"),
  expressAsyncHandler(UC.uploadProfilePic)
);

router.get("/", auth(), validationMiddleware(getUsersSchema) ,expressAsyncHandler(UC.getAllUsers));
router.delete("/", auth(), expressAsyncHandler(UC.deleteUser));

export default router;
