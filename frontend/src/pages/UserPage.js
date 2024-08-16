import React from "react";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import PostCard from "../components/PostCard";

const UserPage = () => {
  const { username } = useParams();
  const { data: user, error: userError, loading: userLoading } = useFetch(`http://localhost:5000/api/users/${username}`);
  const { data: posts, error: postsError, loading: postsLoading } = useFetch("http://localhost:5000/api/posts");

  if (userLoading || postsLoading) return <div>Loading...</div>;
  if (userError) return <div>{userError}</div>;
  if (postsError) return <div>{postsError}</div>;

  if (!user) return <div>User not found</div>;

  // Assuming you store the userId in localStorage or have access to it
  const userId = localStorage.getItem("userId") || ""; // Or however you are managing user IDs

  return (
    <div>
      <h2>Welcome, {user.username}</h2>
      <p>Email: {user.email}</p>
      <main className="content">
        <h2>All Posts</h2>
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post._id} post={post} userId={userId} />
          ))
        ) : (
          <p>No posts available</p>
        )}
      </main>
    </div>
  );
};

export default UserPage;
