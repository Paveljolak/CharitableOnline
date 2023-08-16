import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export const Register = () => {
  const state = useLocation().state;
  const [file, setFile] = useState(state?.img);

  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
  });

  const uploadUserImg = async () => {
    console.log(file);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/uploadUserImg", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const [err, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const UserImgUrl = await uploadUserImg();

    console.log(UserImgUrl);
    try {
      await axios.post("/auth/register", { ...inputs, img: UserImgUrl });
      navigate("/login");
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <div className="auth">
      <h1>Register</h1>
      <form
        action="/api/uploadUserImg"
        method="post"
        encType="multipart/form-data"
      >
        <input
          required
          type="text"
          placeholder="username"
          name="username"
          onChange={handleChange}
        />
        <input
          required
          type="email"
          placeholder="email"
          name="email"
          onChange={handleChange}
        />
        <input
          required
          type="password"
          placeholder="password"
          name="password"
          onChange={handleChange}
        />
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

        <button onClick={handleSubmit}>Register</button>
        {err && <p> {err} </p>}
        <span>
          Do you have an account? <Link to="/login">Login</Link>
        </span>
      </form>
    </div>
  );
};

export default Register;
