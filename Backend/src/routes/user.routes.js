import { User } from "../models/user.models.js";
import { getAllUser, getCurrentUser, getTotalUserCount, loginUser, logOutUser, registerUser } from "../controllers/user.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";


const router = Router(); // created a object for Router from Express

router.route('/register').post(
    upload.single("profileImage"),
    registerUser
)
router.route('/login').post(loginUser)

// Secured Routes

router.route('/logout').post(verifyJWT , logOutUser);
router.route('/').get(verifyJWT, getCurrentUser);

router.use('/admin', verifyJWT, verifyAdmin);
router.get('/admin/all-users', getAllUser);
router.get('/admin/total-user', getTotalUserCount);

export default router