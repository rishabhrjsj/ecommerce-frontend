import React, { useState, useEffect, useCallback } from "react";
import { fetchCart, updateCartItem, deleteCartItem } from "../api";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getCart = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await fetchCart();
      setCart(data);
    } catch (err) {
      setError("Failed to fetch cart data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCart();
  }, [getCart]);

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      const { data } = await updateCartItem(productId, quantity);
      setCart(data);
    } catch (err) {
      alert("Failed to update cart.");
    }
  };

  const handleDeleteItem = async (productId) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      try {
        const { data } = await deleteCartItem(productId);
        setCart(data);
      } catch (err) {
        alert("Failed to remove item from cart.");
      }
    }
  };

  const calculateTotal = () => {
    if (!cart?.items?.length) return 0;

    let total = 0;
    for (const item of cart.items) {
      const price = item.productId?.price || 0;
      total += price * item.quantity;
    }
    return total;
  };

  if (loading) return <p className="loading-message">Loading cart...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!cart || cart.items.length === 0) {
    return (
      <div className="page-container">
        <h2>Your Cart is Empty</h2>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2>Your Shopping Cart</h2>
      <div className="cart-items-container">
        {cart.items.map(
          (item) =>
            item &&
            item.productId && (
              <div key={item.productId._id} className="cart-item">
                <img
                  src={item.productId.image}
                  alt={item.productId.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.productId.name}</h3>
                  <p>Price: ${item.productId.price.toFixed(2)}</p>
                  <div className="cart-item-actions">
                    <label>Quantity:</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateQuantity(
                          item.productId._id,
                          parseInt(e.target.value)
                        )
                      }
                      min="1"
                    />
                    {/* <button
                      onClick={() => handleDeleteItem(item.productId._id)}
                      className="remove-btn">
                      Remove
                    </button> */}
                  </div>
                </div>
                <p className="cart-item-subtotal">
                  Subtotal: ${(item.productId.price * item.quantity).toFixed(2)}
                </p>
              </div>
            )
        )}
      </div>
      <div className="cart-summary">
        <h3>Total: ${calculateTotal().toFixed(2)}</h3>
        <button className="checkout-btn">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
