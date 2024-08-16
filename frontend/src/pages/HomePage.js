import React from "react";
import useFetch from "../hooks/useFetch";
import PostCard from "../components/PostCard";
import "../styles/HomePage.css";

const HomePage = () => {
  const { data: posts, error, loading } = useFetch("http://localhost:5000/api/posts");

  // Retrieve userId from local storage or authentication service
  const userId = localStorage.getItem("userId");

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-page">
      <main className="content">
        <h2>All Posts</h2>
        {posts && posts.length > 0 ? (
          posts.map((post) => <PostCard key={post._id} post={post} userId={userId} />)
        ) : (
          <p className="no-posts">No posts available</p>
        )}
      </main>
    </div>
  );
};

export default HomePage;
