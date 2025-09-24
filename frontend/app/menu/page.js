"use client";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./menu.css";

export default function MenuPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useState({});
  const [selectedVariants, setSelectedVariants] = useState({});

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
              {/* Categories are now handled by the new responsive filter above */}
            </div>
          </div>
        </nav>



        <div
          className="container-fluid"
          style={{ paddingTop: "70px", paddingBottom: "80px" }}
        >
          {/* New Responsive Category Filter */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="category-filter-container">
                <h4 className="fw-bold mb-3" style={{ color: "#124f31" }}>
                  Filter by Category
                </h4>
                
                {/* Desktop & Tablet: Horizontal Scrollable Pills */}
                <div className="d-none d-md-flex category-pills-container">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`category-pill ${
                      selectedCategory === "" ? "active" : ""
                    }`}
                  >
                    All Items ({products.length})
                  </button>
                  {categories.map((cat) => {
                    const count = products.filter((p) => p.category === cat).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`category-pill ${
                          selectedCategory === cat ? "active" : ""
                        }`}
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Mobile: Dropdown Select */}
                <div className="d-md-none">
                  <select
                    className="form-select category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Items ({products.length})</option>
                    {categories.map((cat) => {
                      const count = products.filter((p) => p.category === cat).length;
                      return (
                        <option key={cat} value={cat}>
                          {cat} ({count})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="row">
            <main className="col-12">
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
                      <div key={item._id} className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3">
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
