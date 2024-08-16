// src/pages/LoginPage.js
import React from "react";
import useAuthForm from "../hooks/useAuth";
import Form from "../components/authForm";

const LoginPage = () => {
  const { formData, error, handleChange, handleSubmit } = useAuthForm("http://localhost:5000/api/auth/login", (res) =>
    res.role === "admin" ? "/admin" : `/users/${res.username}`
  );

  return (
    <div>
      <h2>Login</h2>
      <Form
        fields={[
          { name: "email", type: "email", placeholder: "Email" },
          { name: "password", type: "password", placeholder: "Password" },
        ]}
        buttonText="Login"
        onChange={handleChange}
        onSubmit={handleSubmit}
        error={error}
        formData={formData}
      />
    </div>
  );
};

export default LoginPage;
