import express from "express";
import { editProfile, follewingandfollower, getProfile, getsuggestedUser, login, logout, register } from "../../controllers/user.controller";
import isAuthenticated from "../../middleware/jwtToken";
import upload from "../../middleware/multer";
const router = express.Router()


router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated, getProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePhoto'), editProfile);
router.route('/suggested').get(isAuthenticated, getsuggestedUser);
router.route('/follewingandfollower/:id').post(isAuthenticated, follewingandfollower);

export default router;
