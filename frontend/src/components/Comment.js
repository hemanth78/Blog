import React, { useState } from "react";
import axios from "axios";

const Comment = ({ comment, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(comment.text);

  const handleUpdate = async () => {
    await axios.put(
      `/api/posts/${comment.postId}/comments/${comment._id}`,
      { text: newText },
      { headers: { "x-auth-token": localStorage.getItem("token") } }
    );
    onUpdate();
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <>
          <textarea value={newText} onChange={(e) => setNewText(e.target.value)} />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <p>{comment.text}</p>
      )}
      <button onClick={() => setIsEditing(true)}>Edit</button>
      <button onClick={() => onDelete(comment._id)}>Delete</button>
    </div>
  );
};

export default Comment;
