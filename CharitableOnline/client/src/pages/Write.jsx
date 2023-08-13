import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, Link, useNavigate } from "react-router-dom";
import moment from "moment";

export const Write = () => {
  const cat = useLocation().search;
  const state = useLocation().state;
  const [value, setValue] = useState(state?.description || "");
  const [title, setTitle] = useState(state?.title || "");
  const [file, setFile] = useState(state?.img);
  const [Pcategory_id, setPcategory_id] = useState(state?.Pcategory_id || 0);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`/categories${cat}`);
      if (res && res.data) {
        const result = res.data;
        setCategories(result);
      }
    };
    fetchData();
  }, [cat]);

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imgUrl = await upload();
    console.log(file);
    try {
      state
        ? await axios.put(`/posts/${state.id}`, {
            title,
            description: value,
            img: file && imgUrl ? imgUrl : state.img,
            Pcategory_id: Pcategory_id,
          })
        : await axios.post(`/posts/`, {
            title,
            description: value,
            img: file ? imgUrl : "",
            date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            Pcategory_id: Pcategory_id,
          });

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="add">
      <div className="content">
        <input
          type="text"
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="editorContainer">
          <ReactQuill
            className="editor"
            theme="snow"
            value={value}
            onChange={setValue}
          />
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h1>Publish</h1>
          <span>
            <b>Status: </b> Draft
          </span>
          <span>
            <b>Visibility: </b> Public
          </span>
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            name=""
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label className="file" htmlFor="file">
            Upload Image
          </label>
          <div className="buttons">
            <button>Save as a draft</button>
            <Link>
              {" "}
              <button onClick={handleSubmit}>Publish</button>{" "}
            </Link>
          </div>
        </div>
        <div className="item">
          <h1>Category</h1>
          {categories.map((category) => (
            <div className="cat" key={category.id}>
              <input
                type="radio"
                checked={Pcategory_id === category.id}
                name="cat"
                value={category.id}
                id="art"
                onChange={(e) => setPcategory_id(category.id)}
              />
              <label htmlFor="art">{category.name}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Write;
