import React, { useEffect, useState } from "react";
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import axios from "axios";
import moment from "moment";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import DOMPurify from "dompurify";
import Ratings from "react-ratings-declarative";

const Single = () => {
  window.scrollTo(0, 0);
  const [post, setPost] = useState({});

  const location = useLocation();
  const navigate = useNavigate();

  const postId = location.pathname.split("/")[2];

  const { currentUser } = useContext(AuthContext);

  const [comments, setComments] = useState([]);

  const [hasUserGivenRating, sethasUserGivenRating] = useState(false);

  const [userRating, setUserRating] = useState(0);

  const [userRatingId, setUserRatingId] = useState(-1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/posts/${postId}`);
        setPost(res.data);
      } catch (err) {
        console.log(err);
      }

      // Comments:
      try {
        const res = await axios.get(`/posts/comments/${postId}`);
        setComments(res.data);
      } catch (err) {
        console.log(err);
      }

      // Ratings:
      try {
        const res = await axios.get(`/posts/userRating/${postId}`);
        if (res.data) {
          sethasUserGivenRating(true);

          setUserRatingId(res.data.id);
          setUserRating(res.data.stars);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/posts/${postId}`);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await axios.delete(`/posts/comment/${commentId}`);
      window.location.reload(false);
    } catch (err) {
      console.log(err);
    }
  };

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  const setNewRating = async (rating) => {
    try {
      if (hasUserGivenRating) {
        await axios.put(`/posts/rating/${userRatingId}`, {
          stars: rating,
          date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        });
      } else {
        const result = await axios.post(`/posts/rating/${postId}`, {
          stars: rating,
          date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        });

        setUserRatingId(result.data.insertId);
        sethasUserGivenRating(true);
        console.log(result);
      }

      setUserRating(rating);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="single">
      <div className="content">
        <img src={`../upload/${post?.img}`} alt="" />
        <div className="user">
          {post.userImg && <img src={post.userImg} alt="" />}
          <div className="info">
            <span>{post?.username}</span>
            <p>Posted {moment(post.date).fromNow()}</p>
          </div>
          {currentUser?.username === post?.username && (
            <div className="edit">
              <Link to={`/write?edit=2`} state={post}>
                <img src={Edit} alt="" />
              </Link>
              <img onClick={handleDelete} src={Delete} alt="" />
            </div>
          )}
        </div>
        <h1>{post.title}</h1>
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.description),
          }}
        ></p>

        {currentUser !== null && currentUser !== undefined && (
          <div className="ratings">
            <h3>Your rating: </h3>
            <Ratings
              rating={userRating}
              widgetDimensions="35px"
              widgetSpacings="15px"
              changeRating={setNewRating}
            >
              <Ratings.Widget />
              <Ratings.Widget />
              <Ratings.Widget />
              <Ratings.Widget />
              <Ratings.Widget />
            </Ratings>
          </div>
        )}

        <div className="comments">
          <h3>
            COMMENTS:
            {currentUser !== null && currentUser !== undefined && (
              <Link to={`/posts/${postId}/writeComment`}> Write Comment </Link>
            )}
          </h3>

          {comments.map((comment) => (
            <div key={comment.id}>
              <div className="commentBody">
                <div className="comment">
                  <div className="content">
                    <p>{getText(comment.body)}</p>
                  </div>
                </div>
              </div>
              <h4>
                {comment.username}{" "}
                {currentUser?.id === comment?.Comuser_id && (
                  <div className="EditDelete">
                    <Link
                      to={`/posts/${postId}/writeComment?edit=2`}
                      state={comment}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        handleCommentDelete(comment.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </h4>
            </div>
          ))}
        </div>
      </div>
      <Menu cat={post.cat} />
    </div>
  );
};

export default Single;
