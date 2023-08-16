import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "react-ratings-declarative";

const Menu = ({ cat }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/posts/?cat=${cat}`);
        setPosts(res.data.sort((a, b) => (a.average < b.average ? 1 : -1)));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [cat]);

  return (
    <div className="menu">
      <h1>Top posts: </h1>
      {posts.map((post) => (
        <div className="post" key={post.id}>
          <img src={`../upload/${post?.img}`} alt="" />
          <Link className="link" to={`/post/${post.id}`}>
            <h2>{post.title}</h2>
          </Link>

          <div className="ratingsInMenu">
            <h3>Post rating: </h3>
            <Ratings
              rating={post?.average ? post.average : 0}
              widgetDimensions="25px"
              widgetSpacings="10px"
            >
              <Ratings.Widget />
              <Ratings.Widget />
              <Ratings.Widget />
              <Ratings.Widget />
              <Ratings.Widget />
            </Ratings>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;
