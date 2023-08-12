import React, { useEffect, useState } from "react";
import { useLocation, Link} from "react-router-dom";
import axios from "axios";

const SearchResults = () => {
  const [posts, setPosts] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/search?query=${searchQuery}`);
        setSearchResults(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [searchQuery]);

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  return (
    <div className="searchResults">
      <div className="posts">
        {posts.map((post)=>(
          <div className="post" key={post.id}>
            <div className="img">
              <img src={`../upload/${post?.img}`} alt="" />
            </div>
            <div className="content">
              <Link className="link" to={`/post/${post.id}`}>
                {searchQuery}
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

export default SearchResults;
