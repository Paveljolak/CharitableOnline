import React, { useEffect, useState } from "react";
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Menu from "../components/Menu";
import axios from "axios";
import moment from "moment";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import DOMPurify from "dompurify";

const CategoriesSingle = () => {

  const [category, setCategory] = useState({});
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState({});

  const location = useLocation();
  const navigate = useNavigate();

  const categoryId = location.pathname.split("/")[2];

  const { currentUser } = useContext(AuthContext);

  const cat = useLocation().search
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
          const res = await axios.get(`/categories/categories/${categoryId}`);
        const searchValue = searchParams.get("search")
       
        if (searchValue){
          //const result = res.data.filter(p => p.title === searchValue)
          const result = res.data.filter(p => p.title.toLowerCase().includes(searchValue.toLowerCase()))
           
          setPosts(result);

        }else{
          setPosts(res.data);
        }
        
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [cat]);

//   const handleDelete = async ()=>{
//     try {
//       await axios.delete(`/posts/${postId}`);
//       navigate("/")
//     } catch (err) {
//       console.log(err);
//     }
//   }

const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent
  }
 

  return (
    <div className="single">
      <div className="posts">
      {posts.map((post)=>(
          <div className="post" key={post.id}>
            <div className="img">
              <img src={`../upload/${post?.img}`} alt="" />
            </div>
            <div className="content">
              <Link className="link" to={`/post/${post.id}`}>
                <h1>{post.title}</h1>
              </Link>
              <p>{getText(post.description)}</p>
              <button>Read more</button>
            </div> 
          </div> 
          ))}
      </div>
      </div>
  );
};

export default CategoriesSingle;