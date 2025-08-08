import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/product/all", {
        withCredentials: true,
      });
      setProducts(res.data.products);
      if (res.data.products.length > 0) setActiveProduct(res.data.products[0]);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const likeProduct = async (productId) => {
    try {
      await axios.post(
        `http://localhost:5001/api/product/like/${productId}`,
        {},
        { withCredentials: true }
      );
      await fetchProducts();
    } catch (err) {
      console.error("Failed to like product:", err);
    }
  };

  const addComment = async () => {
    if (!newComment.trim() || !activeProduct) return;
    try {
      await axios.post(
        `http://localhost:5001/api/product/comment/${activeProduct._id}`,
        { text: newComment },
        { withCredentials: true }
      );
      setNewComment("");
      await fetchProducts();
      const updated = products.find((p) => p._id === activeProduct._id);
      setActiveProduct(updated);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add comment");
    }
  };

  return (
    <div className="app-layout">
      <div className="product-list">
        {products.map((product) => (
          <div
            key={product._id}
            className={`product-card ${activeProduct?._id === product._id ? "active" : ""}`}
            onClick={() => setActiveProduct(product)}
          >
            <img src={product.image} alt={product.name || "product"} />
            <div className="product-info">
              <p><strong>{product.name}</strong></p>
              <p>Seller: {product.seller?.name || "Unknown"}</p>
              <p>Phone: {product.phone || "N/A"}</p>
              <p>{product.likes?.length || 0} Likes</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  likeProduct(product._id);
                }}
              >
                Like
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeProduct && (
        <div className="comment-sidebar">
          <div className="active-product-info">
            <img src={activeProduct.image} alt={activeProduct.name || "product"} />
            <p>{activeProduct.name}</p>
            <p>Seller: {activeProduct.seller?.name || "Unknown"}</p>
            <p>Phone: {activeProduct.phone || "N/A"}</p>
          </div>
          <div className="comments-list">
            <h4>Comments</h4>
            {(activeProduct.comments?.length || 0) === 0 ? (
              <p>No comments yet.</p>
            ) : (
              activeProduct.comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <strong>{comment.user?.name || "Anonymous"}:</strong> {comment.text}
                </div>
              ))
            )}
          </div>
          <div className="add-comment">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addComment();
                }
              }}
            />
            <button onClick={addComment}>Post</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
