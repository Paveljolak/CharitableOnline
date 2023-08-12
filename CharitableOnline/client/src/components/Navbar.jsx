import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams  } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Img1 from "../img/img1.png"
import axios from "axios";

const Navbar = () => {

  const {currentUser, logout} = useContext(AuthContext); 
  //const {searchValue} = useState("");
  let searchValue1 = "";
  const navigate = useNavigate();
  const location = useLocation();



  const searchValueChanged = (e) => {
    searchValue1 = e.target.value
  }
  
  
  const handleSearch = () => {
    
    navigate(`${location.pathname}?search=${searchValue1}`)

  }

  const handleWrite = () => {
    
      console.log(location.pathname)
      if(location.pathname.includes("categories")){
        navigate("/writeCategory")
      }else{
        navigate("/write")
      }

  }

  
  return (
    <div className='navbar'>
      <div className="container">

        <div className="logo">
          <Link to="/">
            <img src={Img1} alt="" />

          </Link>
        </div>

        <div className="links">
          
        
            <input
              type="text"
              placeholder="Search"
              onChange={searchValueChanged}
              />
              <button type="submit" onClick={handleSearch} >Search</button>
          

          <Link className="link" to="/">
            <h5>Posts</h5>
          </Link>
          <Link className="link" to="/categories">
            <h5>Categories</h5>
          </Link>
          
         
          <span>{currentUser?.username}</span>
          {currentUser ? (
          <span onClick={logout}>Logout</span> ) : ( <Link className="link" to="/login">Login</Link> )}
          <span className="write">
            <button onClick={(handleWrite)} className="link">Write </button>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Navbar  