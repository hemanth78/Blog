// src/pages/RegisterPage.js
import React from "react";
import useAuthForm from "../hooks/useAuth";
import Form from "../components/authForm";

const RegisterPage = () => {
  const { formData, error, handleChange, handleSubmit } = useAuthForm("http://localhost:5000/api/auth/register", () => "/login");

  return (
    <div>
      <h2>Register</h2>
      <Form
        fields={[
          { name: "username", type: "text", placeholder: "Username" },
          { name: "email", type: "email", placeholder: "Email" },
          { name: "password", type: "password", placeholder: "Password" },
        ]}
        buttonText="Register"
        onChange={handleChange}
        onSubmit={handleSubmit}
        error={error}
        formData={formData}
      />
    </div>
  );
};

export default RegisterPage;
