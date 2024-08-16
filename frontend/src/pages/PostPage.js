import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PostPage = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentError, setCommentError] = useState(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [user, setUser] = useState(null);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/${category}/${id}`);
        setPost(response.data);
      } catch (err) {
        setError("Failed to fetch post. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [category, id]);
  

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get("http://localhost:5000/api/users/me", {
            headers: { "x-auth-token": token },
          });
          setUser(response.data);
        } catch (err) {
          console.error("Failed to fetch user data", err);
        }
      }
    };
    fetchUser();
  }, []);

  // Add a comment
  const handleAddComment = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }
    if (!newCommentText.trim()) return;
  
    try {
      await axios.post(
        `http://localhost:5000/api/posts/${post._id}/comments`,
        { text: newCommentText },
        { headers: { "x-auth-token": token } }
      );
      // Re-fetch the post data to ensure the comment is included
      fetchPost();
      setNewCommentText("");
    } catch (err) {
      setCommentError("Failed to add comment. Please try again.");
    }
  };
  
  // Function to fetch the post data
  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/posts/${category}/${id}`);
      setPost(response.data);
    } catch (err) {
      setError("Failed to fetch post. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  // Update a comment
  const handleUpdateComment = async (commentId) => {
    if (!editCommentText.trim()) return;

    try {
      await axios.put(
        `http://localhost:5000/api/posts/${post._id}/comments/${commentId}`,
        { text: editCommentText },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      setPost((prev) => ({
        ...prev,
        comments: prev.comments.map((comment) => (comment._id === commentId ? { ...comment, text: editCommentText } : comment)),
      }));
      setEditingCommentId(null);
      setEditCommentText("");
    } catch (err) {
      setCommentError("Failed to update comment. Please try again.");
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${post._id}/comments/${commentId}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });

      setPost((prev) => ({
        ...prev,
        comments: prev.comments.filter((comment) => comment._id !== commentId),
      }));
    } catch (err) {
      console.error("Error deleting comment:", err);
      setCommentError("Failed to delete comment. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      {post.imageUrl && <img src={post.imageUrl} alt={post.title} />}
      <p>{post.content}</p>
      <p>Category: {post.category}</p>
      <p>Tags: {post.tags.join(", ")}</p>
      <p>Author: {post.author ? post.author.username : "Unknown"}</p>

      <h3>Comments</h3>
      {commentError && <div style={{ color: "red" }}>{commentError}</div>}

      <form onSubmit={handleAddComment}>
        <textarea value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} placeholder="Add a comment..." required />
        <button type="submit">Add Comment</button>
      </form>

      <div>
        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p>
              <b>{comment.user?.username || "Unknown User"}</b> : {comment.text}
            </p>
            {user && (user._id === comment.user?._id || user.role === "admin") && (
              <>
                {editingCommentId === comment._id ? (
                  <div>
                    <textarea value={editCommentText} onChange={(e) => setEditCommentText(e.target.value)} />
                    <button onClick={() => handleUpdateComment(comment._id)}>Save</button>
                    <button onClick={() => setEditingCommentId(null)}>Cancel</button>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => {
                        setEditingCommentId(comment._id);
                        setEditCommentText(comment.text);
                      }}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostPage;
