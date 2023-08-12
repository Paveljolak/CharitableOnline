import express from "express"

import { getCategories,
         getCategory,
         addCategory,
         updateCategory,
         deleteCategory,
         getPostsCategoryId,
 } from "../controllers/category.js"



const router = express.Router()


router.get("/", getCategories);
router.get("/:id", getCategory);
router.get("/categories/:id", getPostsCategoryId);
router.post("/", addCategory);
router.delete("/:id", deleteCategory);
router.put("/:id", updateCategory);





export default router
 