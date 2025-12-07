import { User } from "../models/user.models.js";
import { registerUser } from "../controllers/user.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router(); // created a object for Router from Express

router.route('/register').post(
    upload.single("profileImage"),
    registerUser
)

export default router