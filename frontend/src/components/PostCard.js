import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./PostCard.css";
import axios from "axios";

const PostCard = ({ post, onEdit, onDelete, userId }) => {
  const navigate = useNavigate();

  // Memoize likesArray to avoid unnecessary recalculations
  const likesArray = useMemo(() => (Array.isArray(post.likes) ? post.likes : []), [post.likes]);

  // Initialize state for likes and userLiked
  const [likes, setLikes] = useState(likesArray.length);
  const [userLiked, setUserLiked] = useState(false);

  useEffect(() => {
    // Check authentication and update userLiked state
    const checkUserLiked = () => {
      const localUserId = localStorage.getItem("userId");
      if (localUserId) {
        setUserLiked(likesArray.includes(localUserId));
      } else {
        setUserLiked(false); // Reset userLiked if no userId (visitor case)
      }
    };

    checkUserLiked();
  }, [likesArray]);

  const handleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login page if not authenticated
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/posts/${post._id}/like`, {}, { headers: { "x-auth-token": token } });
      setLikes(response.data.likes);
      setUserLiked(!userLiked);
    } catch (err) {
      console.error("Error liking post", err);
    }
  };

  // Render the like button based on authentication status
  const renderLikeButton = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return <button onClick={handleLike}>Like</button>;
    }

    return <button onClick={handleLike}>{userLiked ? "Dislike" : "Like"}</button>;
  };

  return (
    <div className="post-card">
      {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="post-image" />}
      <h3>
        <Link to={`/posts/${post.category}/${post._id}`}>{post.title}</Link>
      </h3>
      <p>{post.content}</p>
      <p>By {post.author?.username || "Unknown"}</p>
      <b>Likes: {likes}</b>
      {renderLikeButton()}

      {onEdit && <button onClick={() => onEdit(post)}>Edit</button>}
      {onDelete && <button onClick={() => onDelete(post._id)}>Delete</button>}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    author: PropTypes.shape({
      username: PropTypes.string,
    }),
    likes: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  userId: PropTypes.string,
};

export default PostCard;
