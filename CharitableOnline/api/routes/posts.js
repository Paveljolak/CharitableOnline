import express from "express";
import {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
  getCommentsForPost,
  getComment,
  addComment,
  updateComment,
  deleteComment,
  getRatingsForPost,
  updateRating,
  getRating,
  addRatingToPost,
  getRatingByPostAndUserID,
} from "../controllers/post.js";

const router = express.Router();

// ROUTES FOR THE POSTS
router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", addPost);
router.delete("/:id", deletePost);
router.put("/:id", updatePost);

// ROUTES FOR THE COMMENTS

router.get("/comments/:id", getCommentsForPost);
router.put("/comment/:id", updateComment);
router.get("/comment/:id", getComment);
router.post("/comment/", addComment);
router.delete("/comment/:id", deleteComment);

// ROUTES FOR THE RATINGS
router.get("/ratings/:id", getRatingsForPost);
router.put("/rating/:id", updateRating);
router.get("/rating/:id", getRating);
router.post("/rating/:id", addRatingToPost);
router.get("/userRating/:id", getRatingByPostAndUserID);

export default router;
