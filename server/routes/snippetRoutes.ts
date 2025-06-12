import express, { Router } from "express";
import * as snippetController from "../controller/snippetController";
import { isProtect } from "../controller/authController";
const router: Router = express.Router();


router
  .route("/")
  .get(snippetController.getAllSnippet)
  .delete(isProtect,snippetController.deleteSnippet);


router.use(isProtect);

router
   .route("/star-snippet")
   .post(snippetController.addStar);
router.post("/share-snippet", snippetController.createSnipeet);

export default router;
