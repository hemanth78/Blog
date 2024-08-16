import React from "react";
import "./Form.css"; // Add custom styles

const Form = ({
  title,
  content,
  imageUrl,
  category,
  tags,
  onTitleChange,
  onContentChange,
  onImageUrlChange,
  onCategoryChange,
  onTagsChange,
  onSubmit,
  isEditMode,
  onCancel,
}) => {
  // Handle tag input
  const handleTagChange = (e) => {
    const { value } = e.target;
    if (value.endsWith(",")) {
      onTagsChange([...tags, value.slice(0, -1).trim()]);
      e.target.value = "";
    }
  };

  return (
    <form onSubmit={onSubmit} className="form">
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input id="title" type="text" placeholder="Enter post title" value={title} onChange={onTitleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea id="content" placeholder="Enter post content" value={content} onChange={onContentChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl">Image URL</label>
        <input id="imageUrl" type="text" placeholder="Enter image URL" value={imageUrl} onChange={onImageUrlChange} />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select id="category" value={category} onChange={onCategoryChange} required>
          <option value="">Select a category</option>
          <option value="Music">Music</option>
          <option value="Travel">Travel</option>
          <option value="Photography">Photography</option>
          <option value="Another">Another</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="tags">Tags (comma-separated)</label>
        <input id="tags" type="text" placeholder="Enter tags, e.g., Jazz, Classical" onChange={handleTagChange} />
        <div className="tags-container">
          {tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-button">
          {isEditMode ? "Update Post" : "Create Post"}
        </button>
        {isEditMode && (
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default Form;
