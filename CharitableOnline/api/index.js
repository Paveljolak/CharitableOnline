import express from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import categoryRoutes from "./routes/categories.js";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();

app.use(express.json());
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), function (req, res) {
  const file = req.file;

  res.status(200).json(file.filename);
});

const storageUserImg = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/uploadUserImg");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const uploadUserImg = multer({ storage: storageUserImg });

app.post(
  "/api/uploadUserImg",
  uploadUserImg.single("file"),
  function (req, res) {
    const file = req.file;

    res.status(200).json(file.filename);
  }
);

// app.post(
//   "/client/public/uploadUserImg",
//   uploaduserImg.single("file"),
//   function (req, res) {
//     const file = req.file;

//     res.status(200).json(file.filename);
//   }
// );

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes);

app.listen(8800, () => {
  console.log("Connected!");
});
