import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useAuth = (url, successRedirect) => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(url, formData);
      console.log('Login Response:', res.data); // Debugging response
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('userId', res.data.userId); // Store userId if needed

      // Redirect based on role
      const redirectPath = successRedirect(res.data);
      navigate(redirectPath);
    } catch (err) {
      console.error('Login Error:', err.response?.data); // Debugging error
      setError(err.response?.data?.msg || 'An error occurred');
    }
  };

  return { formData, error, handleChange, handleSubmit };
};

export default useAuth;
