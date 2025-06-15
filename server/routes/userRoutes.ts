import express from "express";
import * as authController from "../controller/authController";
import * as userController from "../controller/userController";


const router = express.Router();

router.use(authController.isProtect);
router.get('/user-stats',userController.getUserStats);
router.get('/user-snippets',userController.getUserSnippets);
router.get('/starred-snippets',userController.getUserStarredSnippets);

export default router;
