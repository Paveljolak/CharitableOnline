import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from "axios";
import {useLocation, Link, useNavigate } from "react-router-dom";
import moment from "moment";

function WriteCategory() {
  


  const state = useLocation().state;
  const navigate = useNavigate();

  const [name, setName] = useState(state?.name || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        state
        ? await axios.put(`/categories/${state.id}`, {
            name,
          })
        : await axios.post(`/categories/`, {
            name,
            created_at: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
          
                    
          });
    
          navigate("/categories")
      } catch (err) {
        console.log(err);
      }
    };



    console.log('Category Title:', name);
  

  return (
    <div>
      <h1>Create Category</h1>
      
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Category Name: </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};


export default WriteCategory;
