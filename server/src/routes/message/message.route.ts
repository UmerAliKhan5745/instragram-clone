import express from "express";
 import isAuthenticated from "../../middleware/jwtToken";
import upload from "../../middleware/multer";
import { getMessage, sendMessage } from "../../controllers/message.controller"
const router = express.Router();

router.route('/send/:id').post(isAuthenticated, sendMessage);
router.route('/all/:id').get(isAuthenticated, getMessage);
 
export default router;