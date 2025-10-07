"use client";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./menu.css";
import { useCart } from "../contexts/CartContext";

export default function MenuPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useState({});
  const [selectedVariants, setSelectedVariants] = useState({});
  const { addToCart: addToCartContext, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    // ✅ Load Bootstrap only on client
    import("bootstrap/dist/js/bootstrap.bundle.min.js")
      .then((bootstrap) => {
        console.log("✅ Bootstrap JS loaded");
        const modalEl = document.getElementById("cartModal");
        if (modalEl) {
          new bootstrap.Modal(modalEl);
          console.log("✅ Bootstrap modal initialized");
        }
      })
      .catch((err) => console.error("❌ Bootstrap JS failed", err));

    fetch("http://localhost:5001/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
          setSelectedCategory(""); // show all by default
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const categories = [...new Set(products.map((p) => p.category.trim()))];

  const filteredProducts = selectedCategory
    ? products.filter(
        (p) =>
          p.category.toLowerCase().trim() ===
          selectedCategory.toLowerCase().trim()
      )
    : products;

  const addToCart = (id, variant) => {
    const key = `${id}_${variant}`;
    setCart((prev) => ({ ...prev, [key]: 1 }));
    addToCartContext(key);
  };

  const increaseQty = (id, variant) => {
    const key = `${id}_${variant}`;
    setCart((prev) => {
      const newQty = (prev[key] || 1) + 1;
      updateQuantity(key, newQty);
      return { ...prev, [key]: newQty };
    });
  };

  const decreaseQty = (id, variant) => {
    const key = `${id}_${variant}`;
    setCart((prev) => {
      const newQty = (prev[key] || 1) - 1;
      if (newQty <= 0) {
        const updated = { ...prev };
        delete updated[key];
        removeFromCart(key);
        return updated;
      }
      updateQuantity(key, newQty);
      return { ...prev, [key]: newQty };
    });
  };

  const getCartSummary = () => {
    let totalItems = 0;
    let totalPrice = 0;

    Object.entries(cart).forEach(([key, qty]) => {
      if (qty > 0) {
        const [id, variant] = key.split("_");
        const product = products.find((p) => p._id === id);
        if (product) {
          const variantObj = product.variants.find((v) => v.type === variant);
          if (variantObj) {
            totalItems += qty;
            totalPrice += qty * variantObj.price;
          }
        }
      }
    });

    return { totalItems, totalPrice };
  };

  const { totalItems, totalPrice } = getCartSummary();

  return (
    <>
      <div className="menu-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Our Premium Menu</h1>
            <p className="hero-subtitle">
              Discover our range of handcrafted culinary delights made with natural 
              ingredients and traditional recipes
            </p>
          </div>
        </section>

        <div className="main-container">
          {/* Category Filter */}
          <div className="filter-section">
            <div className="filter-container">
              {/* Desktop & Tablet: Horizontal Pills */}
              <div className="category-pills d-none d-md-flex">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`filter-pill ${
                    selectedCategory === "" ? "active" : ""
                  }`}
                >
                  All Items
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`filter-pill ${
                      selectedCategory === cat ? "active" : ""
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Mobile: Dropdown */}
              <div className="d-md-none">
                <select
                  className="mobile-filter-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Items</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="products-section">
            {filteredProducts.length === 0 ? (
              <div className="empty-state">
                <p>No items found in this category.</p>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((item) => {
                  const selectedVariant =
                    selectedVariants[item._id] || item.variants[0].type;
                  const selectedPrice = item.variants.find(
                    (v) => v.type === selectedVariant
                  )?.price;

                  const cartKey = `${item._id}_${selectedVariant}`;
                  const qty = cart[cartKey] || 0;

                  return (
                    <div key={item._id} className="product-card clean">
                      <div className="product-content">
                        <h3 className="product-title">{item.name}</h3>
                        <p className="product-description">{item.description}</p>

                        {item.variants.length > 1 && (
                          <select
                            className="variant-select"
                            value={selectedVariant}
                            onChange={(e) =>
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [item._id]: e.target.value,
                              }))
                            }
                          >
                            {item.variants.map((v) => (
                              <option key={v.type} value={v.type}>
                                {v.type} - ₹{v.price}
                              </option>
                            ))}
                          </select>
                        )}

                        <div className="price-section">
                          <span className="product-price">₹{selectedPrice}</span>
                        </div>

                        <div className="product-actions">
                          {qty > 0 ? (
                            <div className="quantity-controls">
                              <button
                                className="qty-btn minus"
                                onClick={() =>
                                  decreaseQty(item._id, selectedVariant)
                                }
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                              </button>
                              <span className="qty-display">{qty} in cart</span>
                              <button
                                className="qty-btn plus"
                                onClick={() =>
                                  increaseQty(item._id, selectedVariant)
                                }
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <line x1="12" y1="5" x2="12" y2="19"></line>
                                  <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                              </button>
                              <button
                                className="remove-from-cart"
                                onClick={() => {
                                  setCart((prev) => {
                                    const updated = { ...prev };
                                    delete updated[cartKey];
                                    return updated;
                                  });
                                  removeFromCart(cartKey);
                                }}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <polyline points="3,6 5,6 21,6"></polyline>
                                  <path d="M19,6V20a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <button
                              className="add-to-cart-btn"
                              onClick={() =>
                                addToCart(item._id, selectedVariant)
                              }
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                              </svg>
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        </div>

      {/* Cart Modal (outside menu-page) */}
      <div
        className="modal fade"
        id="cartModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Your Cart</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {totalItems === 0 ? (
                <p className="text-muted">Your cart is empty</p>
              ) : (
                <ul className="list-group">
                  {Object.entries(cart).map(([key, qty]) => {
                    if (qty > 0) {
                      const [id, variant] = key.split("_");
                      const product = products.find((p) => p._id === id);
                      if (!product) return null;
                      const variantObj = product.variants.find(
                        (v) => v.type === variant
                      );
                      return (
                        <li
                          key={key}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <strong>{product.name}</strong> ({variant})
                            <br />
                            <span className="text-muted">
                              ₹{variantObj.price}
                            </span>
                          </div>
                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-sm"
                              style={{
                                background: "#dd9933",
                                color: "#fff",
                              }}
                              onClick={() => decreaseQty(id, variant)}
                            >
                              –
                            </button>
                            <span className="mx-2">{qty}</span>
                            <button
                              className="btn btn-sm"
                              style={{
                                background: "#124f31",
                                color: "#fff",
                              }}
                              onClick={() => increaseQty(id, variant)}
                            >
                              +
                            </button>
                            <button
                              className="remove-btn ms-3"
                              onClick={() => {
                                setCart((prev) => {
                                  const updated = { ...prev };
                                  delete updated[key];
                                  return updated;
                                });
                                removeFromCart(key);
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </li>
                      );
                    }
                    return null;
                  })}
                </ul>
              )}
            </div>
            {totalItems > 0 && (
              <div className="modal-footer">
                <h5 className="me-auto">Total: ₹{totalPrice}</h5>
                <button className="btn btn-success">Checkout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
