import React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";
import Ratings from "react-ratings-declarative";

const Home = () => {
  const [posts, setPosts] = useState([]);

  const cat = useLocation().search;
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/posts${cat}`);
        const searchValue = searchParams.get("search");
        console.log(res.data);
        if (searchValue) {
          //const result = res.data.filter(p => p.title === searchValue)
          const result = res.data.filter((p) =>
            p.title.toLowerCase().includes(searchValue.toLowerCase())
          );

          setPosts(result);
        } else {
          setPosts(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [cat]);

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  return (
    <div className="home">
      <div className="posts">
        {posts.map((post) => (
          <div className="post" key={post.id}>
            <div className="img">
              <img src={`../upload/${post?.img}`} alt="" />
            </div>
            <div className="content">
              <Link className="link" to={`/post/${post.id}`}>
                <h1>{post.title}</h1>
              </Link>
              <p>{getText(post.description)}</p>
              <div className="ratings">
                <h3>Post rating: </h3>
                <Ratings
                  rating={post?.average ? post.average : 0}
                  widgetDimensions="35px"
                  widgetSpacings="15px"
                >
                  <Ratings.Widget />
                  <Ratings.Widget />
                  <Ratings.Widget />
                  <Ratings.Widget />
                  <Ratings.Widget />
                </Ratings>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
