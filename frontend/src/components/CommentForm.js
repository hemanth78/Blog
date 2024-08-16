import React, { useState } from "react";

const CommentForm = ({ onSubmit, initialText = "", submitLabel }) => {
  const [text, setText] = useState(initialText);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment..." required />
      <button type="submit">{submitLabel}</button>
    </form>
  );
};

export default CommentForm;
