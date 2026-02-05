import React, { useState, useEffect, useCallback } from "react";
import { fetchProducts, addToCart, createProduct } from "../api";
import { useNavigate } from "react-router-dom";

const AddProductForm = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!image) {
      setError("Please select an image for the product.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("image", image);

    try {
      await createProduct(data);
      alert("Product added successfully!");
      e.target.reset();
      setFormData({ name: "", description: "", price: "", stock: "" });
      setImage(null);
      onProductAdded();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to add product.");
      console.error(err);
    }
  };

  return (
    <div className="add-product-form-container">
      <h3>Add a New Product</h3>
      <form onSubmit={handleSubmit} className="add-product-form">
        {error && <p className="error-message">{error}</p>}
        <input
          name="name"
          value={formData.name}
          placeholder="Product Name"
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          value={formData.description}
          placeholder="Product Description"
          onChange={handleChange}
          required
        />
        <input
          name="price"
          value={formData.price}
          type="number"
          placeholder="Price"
          onChange={handleChange}
          required
        />
        <input
          name="stock"
          value={formData.stock}
          type="number"
          placeholder="Stock"
          onChange={handleChange}
          required
        />
        <input name="image" type="file" onChange={handleFileChange} required />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const getProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError("Could not fetch products.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const handleAddToCart = async (productId) => {
    if (!token) {
      navigate("/signin");
      return;
    }
    try {
      await addToCart(productId, 1);
      alert("Product added to cart!");
    } catch (err) {
      alert("Failed to add product to cart.");
      console.error(err);
    }
  };

  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="page-container">
      {token && <AddProductForm onProductAdded={getProducts} />}

      <h2>Products</h2>
      {loading ? (
        <p className="loading-message">Loading products...</p>
      ) : (
        <div className="product-list">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-price">
                  ${Number(product.price).toFixed(2)}
                </p>
                <button onClick={() => handleAddToCart(product._id)}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
