
import express from "express";
import isAuthenticated from "../../middleware/jwtToken";
import upload from "../../middleware/multer";
import {  addComment, addNewPost, bookmarkPost, deletePost, dislikePost, getAllPost, getCommentsOfPost, getUserPost, likePost } from '../../controllers/post.controller'

const router = express.Router();
router.route("/addpost").post(isAuthenticated, upload.single('image'), addNewPost);
router.route("/all").get(isAuthenticated,getAllPost);
router.route("/userpost/all").get(isAuthenticated, getUserPost);
router.route("/like/:id").get(isAuthenticated, likePost);
router.route("/dislike/:id").get(isAuthenticated, dislikePost);
router.route("/comment/:id").post(isAuthenticated, addComment); 
router.route("/comment/all/:id").post(isAuthenticated, getCommentsOfPost);
router.route("/delete/:id").delete(isAuthenticated, deletePost);
router.route("/bookmark/:id").get(isAuthenticated, bookmarkPost);



export default router;
