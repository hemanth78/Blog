import React, { useState } from "react";
import axios from "axios";
import useFetch from "../hooks/useFetch";
import PostCard from "../components/PostCard";
import Form from "../components/Form";

const Admin = () => {
  const [editMode, setEditMode] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);

  const token = localStorage.getItem("token");
  const { data: posts, error, loading, refetch } = useFetch("http://localhost:5000/api/posts", token);

  const handleCreateOrEditPost = async (e) => {
    e.preventDefault();
    const url = editMode ? `http://localhost:5000/api/posts/${editPostId}` : "http://localhost:5000/api/posts";
    const method = editMode ? "put" : "post";

    try {
      await axios[method](url, { title, content, imageUrl, category, tags }, { headers: { "x-auth-token": token } });
      // Clear form after successful submission
      setEditMode(false);
      setEditPostId(null);
      setTitle("");
      setContent("");
      setImageUrl("");
      setCategory("");
      setTags([]);
      refetch();
    } catch (err) {
      console.error("Error creating/updating post", err);
    }
  };

  const handleEditClick = (post) => {
    setEditMode(true);
    setEditPostId(post._id);
    setTitle(post.title);
    setContent(post.content);
    setImageUrl(post.imageUrl || "");
    setCategory(post.category || "");
    setTags(post.tags || []);
  };

  const handleDeletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`, { headers: { "x-auth-token": token } });
      refetch();
    } catch (err) {
      console.error("Error deleting post", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <Form
        title={title}
        content={content}
        imageUrl={imageUrl}
        category={category}
        tags={tags}
        onTitleChange={(e) => setTitle(e.target.value)}
        onContentChange={(e) => setContent(e.target.value)}
        onImageUrlChange={(e) => setImageUrl(e.target.value)}
        onCategoryChange={(e) => setCategory(e.target.value)}
        onTagsChange={(newTags) => setTags(newTags)}
        onSubmit={handleCreateOrEditPost}
        isEditMode={editMode}
        onCancel={() => {
          setEditMode(false);
          setEditPostId(null);
          setTitle("");
          setContent("");
          setImageUrl("");
          setCategory("");
          setTags([]);
        }}
      />
      <h2>Posts</h2>
      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={post._id} post={post} onEdit={handleEditClick} onDelete={handleDeletePost} />)
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export default Admin;
