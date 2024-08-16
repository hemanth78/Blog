// pages/CategoryPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import PostCard from "../components/PostCard";

const CategoryPage = () => {
  const { category } = useParams();
  const { data: posts, error, loading } = useFetch(`http://localhost:5000/api/posts?category=${category}`);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Posts related to {category}</h1>
      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      ) : (
        <p>No posts available in this category</p>
      )}
    </div>
  );
};

export default CategoryPage;
