import React from "react";

const authForm = ({ fields, buttonText, onChange, onSubmit, error, formData }) => (
  <form onSubmit={onSubmit}>
    {fields.map(({ name, type, placeholder }) => (
      <div key={name}>
        <label>{placeholder}:</label>
        <input type={type} name={name} placeholder={placeholder} value={formData[name] || ""} onChange={onChange} />
      </div>
    ))}
    <button type="submit">{buttonText}</button>
    {error && <p>{error}</p>}
  </form>
);

export default authForm;
