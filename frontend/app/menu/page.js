"use client";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./menu.css";

export default function MenuPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useState({});
  const [selectedVariants, setSelectedVariants] = useState({});
  const [showCategories, setShowCategories] = useState(false);
  const [username, setUsername] = useState(null);

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

    const storedUser = localStorage.getItem("username");
    if (storedUser) setUsername(storedUser);
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
  };

  const increaseQty = (id, variant) => {
    const key = `${id}_${variant}`;
    setCart((prev) => ({ ...prev, [key]: (prev[key] || 1) + 1 }));
  };

  const decreaseQty = (id, variant) => {
    const key = `${id}_${variant}`;
    setCart((prev) => {
      const newQty = (prev[key] || 1) - 1;
      if (newQty <= 0) {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      }
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
        {/* ✅ Navbar */}
        <nav
          className="navbar navbar-dark fixed-top"
          style={{ backgroundColor: "#124f31" }}
        >
          <div className="container-fluid">
            <span className="navbar-brand mb-0 h1">The Quisine 🍲</span>

            <div className="d-flex align-items-center">
              <button
                className="btn btn-sm text-white d-md-none me-3"
                style={{ backgroundColor: "#dd9933" }}
                onClick={() => setShowCategories(!showCategories)}
              >
                ☰ Categories
              </button>

              {/* ✅ User Account */}
              {username ? (
                <div className="dropdown">
                  <button
                    className="btn btn-light dropdown-toggle"
                    type="button"
                    id="userMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    👤 {username}
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="userMenuButton"
                  >
                    <li>
                      <a className="dropdown-item" href="/orders">
                        Orders
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="/account">
                        Account Details
                      </a>
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={() => {
                          localStorage.removeItem("username");
                          setUsername(null);
                          window.location.href = "/auth";
                        }}
                      >
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <a
                  href="/auth"
                  className="btn btn-sm text-white"
                  style={{ backgroundColor: "#dd9933" }}
                >
                  Sign In
                </a>
              )}
            </div>
          </div>
        </nav>

        <div
          className="container-fluid"
          style={{ paddingTop: "70px", paddingBottom: "80px" }}
        >
          <div className="row">
            {/* Sidebar */}
            <aside className="col-md-3 border-end pt-4 bg-white d-none d-md-block">
              <h4 className="fw-bold mb-3">Categories</h4>
              <ul className="list-unstyled">
                {categories.map((cat) => {
                  const count = products.filter((p) => p.category === cat).length;
                  return (
                    <li key={cat} className="mb-2">
                      <button
                        onClick={() => setSelectedCategory(cat)}
                        className={`btn w-100 text-start fw-bold ${
                          selectedCategory === cat
                            ? "active-category"
                            : "btn-outline-secondary"
                        }`}
                      >
                        {cat} ({count})
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>

            {/* Products */}
            <main className="col-md-9 pt-4">
              <h2 className="fw-bold mb-4" style={{ color: "#124f31" }}>
                {selectedCategory || "All Items"}
              </h2>

              {filteredProducts.length === 0 ? (
                <p>No items found in this category.</p>
              ) : (
                <div className="row g-3">
                  {filteredProducts.map((item) => {
                    const selectedVariant =
                      selectedVariants[item._id] || item.variants[0].type;
                    const selectedPrice = item.variants.find(
                      (v) => v.type === selectedVariant
                    )?.price;

                    const cartKey = `${item._id}_${selectedVariant}`;
                    const qty = cart[cartKey] || 0;

                    return (
                      <div key={item._id} className="col-12 col-sm-6 col-lg-4">
                        <div className="card h-100 shadow-sm">
                          <div className="card-body d-flex flex-column">
                            <h5 className="card-title fw-bold">{item.name}</h5>
                            <p className="card-text text-muted">
                              {item.description}
                            </p>

                            {item.variants.length > 1 && (
                              <select
                                className="form-select mb-2"
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

                            <p className="fw-bold" style={{ color: "#124f31" }}>
                              ₹{selectedPrice || item.variants[0].price}
                            </p>

                            <div className="mt-auto">
                              {qty > 0 ? (
                                <div className="d-flex align-items-center border rounded overflow-hidden">
                                  <button
                                    className="btn flex-fill"
                                    style={{
                                      background: "#dd9933",
                                      color: "#fff",
                                    }}
                                    onClick={() =>
                                      decreaseQty(item._id, selectedVariant)
                                    }
                                  >
                                    –
                                  </button>
                                  <span className="flex-fill text-center fw-bold">
                                    {qty}
                                  </span>
                                  <button
                                    className="btn flex-fill"
                                    style={{
                                      background: "#124f31",
                                      color: "#fff",
                                    }}
                                    onClick={() =>
                                      increaseQty(item._id, selectedVariant)
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                <button
                                  className="btn w-100 fw-bold"
                                  style={{
                                    background: "#124f31",
                                    color: "#fff",
                                  }}
                                  onClick={() =>
                                    addToCart(item._id, selectedVariant)
                                  }
                                >
                                  Add to Cart
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </main>
          </div>
        </div>

        {/* Floating Cart Button */}
        <button
          type="button"
          className="floating-cart"
          data-bs-toggle="modal"
          data-bs-target="#cartModal"
        >
          <div className="cart-circle">
            🛒
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </div>
        </button>
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
                              onClick={() =>
                                setCart((prev) => {
                                  const updated = { ...prev };
                                  delete updated[key];
                                  return updated;
                                })
                              }
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
