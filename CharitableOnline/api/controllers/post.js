import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
  const q = req.query.cat
    ? "SELECT * FROM posts WHERE cat=?"
    : "SELECT * FROM posts";

  const q1 = `SELECT 
  p.id, p.title, p.description, p.img, p.date, p.user_id, p.Pcategory_id, AVG(r.stars) 
  AS average
  FROM posts p LEFT OUTER JOIN ratings r ON p.id=r.Rpost_id 
  group by p.id, p.title, p.description, p.img, p.date, p.user_id, p.Pcategory_id`;

  db.query(q1, [req.query.cat], (err, data) => {
    if (err) return res.status(500).send(err);

    return res.status(200).json(data);
  });
};

export const getPost = (req, res) => {
  const q =
    "SELECT p.id, username, title, description, Pcategory_id, p.img, u.img AS userImage, date FROM users u JOIN posts p ON u.id=p.user_id WHERE p.id = ? ";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data[0]);
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO posts (`title`, `description`, `img`, `date`, `user_id`, `Pcategory_id`) VALUES ?";

    const values = [
      [
        req.body.title,
        req.body.description,
        req.body.img,
        req.body.date, // Make sure this is a correctly formatted date string
        userInfo.id,
        req.body.Pcategory_id,
      ],
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been created.");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;

    const deleteCommentsQuery = "DELETE FROM comments WHERE Compost_id = ?";

    db.query(deleteCommentsQuery, [postId], (err, data) => {
      if (err) return res.status(403).json("You can delete only your posts!");
    });

    const deleteRatingsQuery = "DELETE FROM ratings WHERE Rpost_id = ?";

    db.query(deleteRatingsQuery, [postId], (err, data) => {
      if (err) return res.status(403).json("You can delete only your posts!");
    });

    const q = "DELETE FROM posts WHERE id= ? AND user_id = ? ";

    db.query(q, [postId, userInfo.id], (err, data) => {
      if (err) return res.status(403).json("You can delete only your posts!");

      return res.json("Post has been deleted!");
    });
  });
};

export const updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;
    const q =
      "UPDATE posts SET `title`=?,`description`=?,`img`=?,`Pcategory_id`=? WHERE `id` = ? AND `user_id` = ?";

    // if(!req.body.img || req.body.img === ""){
    // req.body.img = "DefaultCat.png"
    // }
    const values = [
      req.body.title,
      req.body.description,
      req.body.img,
      req.body.Pcategory_id,
    ];

    db.query(q, [...values, postId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been updated.");
    });
  });
};

// COMMENTS_______________________________________________________________________________________________________________________________
// COMMENTS_______________________________________________________________________________________________________________________________
// COMMENTS_______________________________________________________________________________________________________________________________
// COMMENTS_______________________________________________________________________________________________________________________________
// COMMENTS_______________________________________________________________________________________________________________________________

export const getCommentsForPost = (req, res) => {
  const q =
    "SELECT c.id, c.Comuser_id, c.body, c.created_at, c.Compost_id, u.username FROM comments AS c, users AS u WHERE Compost_id = ? AND u.id = c.Comuser_id ";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
};

export const getComment = (req, res) => {
  const q = "SELECT * FROM comments WHERE id = ?";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
};

export const addComment = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO comments (Comuser_id, `body`, `created_at`, `Compost_id`) VALUES ?";

    const values = [
      [
        userInfo.id,
        req.body.body,
        req.body.created_at, // Make sure this is a correctly formatted date string
        req.body.Compost_id,
      ],
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  });
};

export const updateComment = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "UPDATE comments SET `body`=? WHERE `id` = ?";

    const values = [req.body.body];

    db.query(q, [...values, req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Comment has been updated.");
    });
  });
};

export const deleteComment = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const commentId = req.params.id;
    const q = "DELETE FROM comments WHERE id= ?";

    db.query(q, [commentId], (err, data) => {
      if (err)
        return res.status(403).json("You can delete only your comments!");

      return res.json("Comment has been deleted!");
    });
  });
};

// RATINGS ______________________________________________________________________________________________________________________
// RATINGS ______________________________________________________________________________________________________________________
// RATINGS ______________________________________________________________________________________________________________________
// RATINGS ______________________________________________________________________________________________________________________
// RATINGS ______________________________________________________________________________________________________________________

export const addRatingToPost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO ratings (`Rpost_id`, `Ruser_id`, `date`, `stars`) VALUES ?";

    const values = [
      [
        req.params.id,
        userInfo.id,
        req.body.date, // Make sure this is a correctly formatted date string
        req.body.stars,
      ],
    ];

    db.query(q, [values], (err, data) => {
      console.log(err);
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  });
};

export const updateRating = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "UPDATE ratings SET `stars`=?, `date`=? WHERE `id` = ?";

    const values = [req.body.stars, req.body.date];

    db.query(q, [...values, req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Rating has been updated.");
    });
  });
};

export const getRatingsForPost = (req, res) => {};

export const getRating = (req, res) => {};

export const getRatingByPostAndUserID = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "SELECT * FROM ratings WHERE `Ruser_id`=? AND `Rpost_id`=?";

    db.query(q, [userInfo.id, req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data[0]);
    });
  });
};
