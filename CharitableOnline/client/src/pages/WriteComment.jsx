import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, Link, useNavigate } from "react-router-dom";
import moment from "moment";

export const WriteComment = () => {
  const cat = useLocation().search;
  const state = useLocation().state;
  const [value, setValue] = useState(state?.body || "");

  const postId = window.location.pathname.split("/")[2];

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      state
        ? await axios.put(`/posts/comment/${state?.id}`, {
            body: value,
          })
        : await axios.post(`/posts/comment/`, {
            body: value,
            created_at: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            Compost_id: postId,
          });

      navigate(`/post/${postId}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="add">
      <div className="content">
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
        <button onClick={handleSubmit}>Publish</button>
      </div>
    </div>
  );
};

export default WriteComment;
