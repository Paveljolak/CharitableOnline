import { db } from "../db.js";
import jwt from "jsonwebtoken";
import { deletePost } from "./post.js";

export const getCategories = (req, res) => {
  const q = "SELECT * FROM categories";

  db.query(q, (err, data) => {
    if (err) return res.status(500).send(err);

    return res.status(200).json(data);
  });
};

export const getPostsCategoryId = (req, res) => {
  const categoryId = req.params.id;
  const q = "SELECT * FROM posts WHERE Pcategory_id = ? ";

  db.query(q, [categoryId], (err, data) => {
    if (err) return res.status(500).send(err);

    return res.status(200).json(data);
  });
};

export const getCategory = (req, res) => {
  const categoryId = req.params.id;

  const q = "SELECT * FROM categories WHERE id = ?";

  db.query(q, [categoryId], (err, data) => {
    if (err) return res.status(500).send(err);

    if (data.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json(data[0]); // Assuming data[0] is the category object
  });
};

export const addCategory = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const { name, created_at } = req.body;

    const q =
      "INSERT INTO categories (name, created_at, Cuser_id) VALUES (?, ?, ?)";
    db.query(q, [name, created_at, userInfo.id], (err, result) => {
      console.log(err);
      if (err) return res.status(500).send(err);

      const newCategoryId = result.insertId;
      return res.status(201).json({ id: newCategoryId, name, created_at });
    });
  });
};

export const deleteCategory = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const categoryId = req.params.id;
    const getPostsForDeletionQuery =
      "SELECT id FROM posts WHERE Pcategory_id = ?";
    db.query(
      getPostsForDeletionQuery,
      [[parseInt(categoryId)]],
      (err, data) => {
        console.log(err);
        if (err)
          return res.status(403).json("You can delete only your categories!");

        let postIdsForDeletingString = ""; //cuz we are changing it
        if (data[0] && data[0].length > 1) {
          postIdsForDeletingString = data[0].join(", ");
        } else {
          postIdsForDeletingString = "?";
        }

        const deletePostCommentsQuery = `DELETE FROM comments WHERE Compost_id IN (${postIdsForDeletingString})`;

        db.query(deletePostCommentsQuery, data[0], (err, data) => {
          console.log(err);
          if (err)
            return res.status(403).json("You can delete only your categories!");
        });

        const deletePostRatingsQuery = `DELETE FROM ratings WHERE Rpost_id IN (${postIdsForDeletingString})`;

        db.query(deletePostRatingsQuery, data[0], (err, data) => {
          console.log(err);
          if (err)
            return res.status(403).json("You can delete only your categories!");
        });

        const deletePostQuery = `DELETE FROM posts WHERE id IN (${postIdsForDeletingString})`;

        db.query(deletePostQuery, data[0], (err, data) => {
          console.log(err);
          if (err)
            return res.status(403).json("You can delete only your categories!");
        });
      }
    );

    const q = "DELETE FROM categories WHERE id = ? AND Cuser_id = ? ";

    //     const q1 = req.query.cat ? "DELETE * FROM posts AS p, categories AS c WHERE p.category_id = c.id"
    // : "DELETE * FROM categories WHERE id = ?";

    db.query(q, [parseInt(categoryId), userInfo.id], (err, data) => {
      console.log(err);
      if (err)
        return res.status(403).json("You can delete only your categories!");

      return res.json("Post has been deleted!");
    });
  });
};

export const updateCategory = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const categoryId = req.params.id;

    const { name, created_at, id } = req.body;

    const q =
      "UPDATE categories SET `name`=? WHERE `id` = ? AND `Cuser_id` = ?";
    db.query(q, [name, categoryId, userInfo.id], (err, result) => {
      console.log(err);
      if (err) return res.status(500).send(err);

      const newCategoryId = result.insertId;
      return res.status(201).json({ id: newCategoryId, name, created_at });
    });
  });
};
