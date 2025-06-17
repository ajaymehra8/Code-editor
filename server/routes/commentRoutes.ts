import express from "express";
import * as commentController from "../controller/commentController";
import * as authController from "../controller/authController";

const router = express.Router();

router.use(authController.isProtect);
router
  .get("/", commentController.getAllComments)
  .post("/", commentController.doComment);

export default router;
