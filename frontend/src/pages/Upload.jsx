import React, { useState } from "react";
import axios from "axios";

const Upload = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageUrl || !isValidUrl(imageUrl)) {
      setError("Please enter a valid image URL");
      setSuccess("");
      return;
    }

    if (!productName.trim()) {
      setError("Product name is required");
      setSuccess("");
      return;
    }

    if (!price || isNaN(price)) {
      setError("Please enter a valid numeric price");
      setSuccess("");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5001/api/product/upload",
        {
          image: imageUrl,
          name: productName,
          description,
          price,
        },
        { withCredentials: true }
      );

      setSuccess("Product uploaded successfully!");
      setImageUrl("");
      setProductName("");
      setDescription("");
      setPrice("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
      setSuccess("");
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Product</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <input
          type="url"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          min="0"
          step="any"
        />
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit">Upload Product</button>
      </form>
    </div>
  );
};

export default Upload;
