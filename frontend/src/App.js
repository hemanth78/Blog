import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostPage from './pages/PostPage';
import Admin from './pages/Admin';
import UserPage from './pages/UserPage';
import ProtectedRoute from './components/ProtectedRoute';
import CategoryPage from './pages/CategoryPage';
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar /> {/* Move Navbar outside of Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<ProtectedRoute element={<Admin />} requiredRole="admin" />} />
        <Route path="/users/:username" element={<ProtectedRoute element={<UserPage />} requiredRole="user" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/posts/:category/:id" element={<PostPage />} />
        <Route path="/posts/:category" element={<CategoryPage />} />
      </Routes>
    </>
  );
}

export default App;
