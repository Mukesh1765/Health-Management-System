import { useEffect, useState } from "react";
import MedicinesService from "../assets/MedicinesService";
import OrdersService from "../assets/OrdersService";
import "../styles/medicines.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Medicines() {
    const [medicines, setMedicines] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [cart, setCart] = useState([]);
    const [address, setAddress] = useState("");
    const [currentOrder, setCurrentOrder] = useState(null);
    const [creating, setCreating] = useState(false);

    const navigate = useNavigate();

    // Dispatch cart event for header
    const updateCartEvent = (count) => {
        window.dispatchEvent(
            new CustomEvent("cart-updated", { detail: { count } })
        );
    };

    // Load saved cart
    useEffect(() => {
        const saved = localStorage.getItem("med-cart");
        if (saved) {
            const parsed = JSON.parse(saved);
            setCart(parsed);
            updateCartEvent(parsed.length);
        }
    }, []);
    function getCartItemsCount() {
        let count = 0;
        cart.map((c) => {
            count += c.qty;
        });
        return count;
    }
    // Save cart and update header
    useEffect(() => {
        localStorage.setItem("med-cart", JSON.stringify(cart));
        localStorage.setItem("med-cart-count", getCartItemsCount().toString());
        updateCartEvent(cart.length);
    }, [cart]);

    // Load initial meds + categories
    const loadData = async () => {
        setLoading(true);
        try {
            const meds = await MedicinesService.search(search);
            setMedicines(meds || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        MedicinesService.getCategories().then((c) => setCategories([...c]));
    }, []);

    // Search suggestions
    useEffect(() => {
        if (!search.trim()) {
            setSuggestions([]);
            loadData();
            return;
        }

        const delay = setTimeout(async () => {
            const meds = await MedicinesService.search(search);
            setSuggestions(
                meds.filter((m) =>
                    m.name.toLowerCase().includes(search.toLowerCase())
                )
            );
            setMedicines(meds);
        }, 150);

        return () => clearTimeout(delay);
    }, [search]);

    // Cart functions
    const addToCart = (med) => {
        setCart((prev) => {
            const found = prev.find((x) => x._id === med._id);
            if (found) {
                return prev.map((x) =>
                    x._id === med._id ? { ...x, qty: x.qty + 1 } : x
                );
            }
            return [...prev, { ...med, qty: 1 }];
        });
        toast.success("Added to cart");
    };

    const removeFromCart = (id) => {
        setCart((c) => c.filter((x) => x._id !== id));
    };

    const changeQty = (id, qty) => {
        if (qty < 1) return;
        setCart((c) => c.map((x) => (x._id === id ? { ...x, qty } : x)));
    };

    const clearCart = () => {
        setCart([]);
        toast("Cart cleared");
    };

    const total = cart.reduce((s, it) => s + it.price * it.qty, 0);

    // Create order
    const createOrder = async () => {
        if (!address.trim()) return toast.error("Enter address first");
        if (cart.length === 0) return toast.error("Cart empty");

        setCreating(true);

        try {
            const items = cart.map((c) => ({
                medicineId: c._id,
                qty: c.qty,
            }));

            const data = await OrdersService.createOrder({
                items,
                address,
            });

            if (!data.success) throw new Error(data.message);

            setCurrentOrder(data.order);

            if (data.upiUri) window.location.href = data.upiUri;
        } catch (err) {
            toast.error(err.message);
        } finally {
            setCreating(false);
        }
    };

    const confirmPayment = async () => {
        const tx = window.prompt("Enter UPI reference");
        if (!tx) return;

        const data = await OrdersService.confirmOrder(currentOrder._id, tx);

        if (data.success) {
            toast.success("Payment confirmed");
            clearCart();
            navigate("/role");
        } else {
            toast.error(data.message);
        }
    };

    const filtered = medicines.filter((m) =>
        activeCategory === "All"
            ? true
            : m.category?.toLowerCase() === activeCategory.toLowerCase()
    );

    return (
        <div className="med-page">
            <div className="med-header">
                <button className="back-btn" onClick={() => navigate("/role")}>
                    ← Back
                </button>
                <h1>Order Medicines</h1>
            </div>

            {/* Search */}
            <div className="search-box">
                <input
                    placeholder="Search for tablets, syrups..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {suggestions.length > 0 && (
                    <div className="suggestions">
                        {suggestions.map((s) => (
                            <div
                                key={s._id}
                                onClick={() => {
                                    setSearch(s.name);
                                    setSuggestions([]);
                                }}
                                className="suggestion-item"
                            >
                                {s.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Categories */}
            <div className="med-categories">
                {categories.map((c) => (
                    <button
                        key={c}
                        className={activeCategory === c ? "active" : ""}
                        onClick={() => setActiveCategory(c)}
                    >
                        {c}
                    </button>
                ))}
            </div>

            {/* Main Grid */}
            <div className="med-grid">
                <div className="med-list">
                    {filtered.map((m) => (
                        <div key={m._id} className="med-card">
                            <div className="med-name">{m.name}</div>
                            <div className="med-desc">{m.description}</div>
                            <div className="med-meta">
                                ₹{m.price} — {m.category}
                            </div>
                            <button
                                className="add-btn"
                                onClick={() => addToCart(m)}
                            >
                                Add
                            </button>
                        </div>
                    ))}
                </div>

                {/* Cart */}
                <div className="med-cart">
                    <h3>Cart</h3>

                    {cart.length === 0 && (
                        <div className="cart-empty">Cart is empty</div>
                    )}

                    {cart.map((c) => (
                        <div className="cart-row" key={c._id}>
                            <div>
                                <div className="cart-name">{c.name}</div>
                                <div className="cart-meta">₹{c.price}</div>
                            </div>

                            <div className="cart-controls">
                                <input
                                    type="number"
                                    value={c.qty}
                                    min="1"
                                    onChange={(e) =>
                                        changeQty(c._id, Number(e.target.value))
                                    }
                                />
                                <button
                                    className="remove-btn"
                                    onClick={() => removeFromCart(c._id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    {cart.length > 0 && (
                        <>
                            <textarea
                                className="address-box"
                                placeholder="Enter delivery address..."
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />

                            <div className="total">Total: ₹{total}</div>

                            <button
                                className="checkout-btn"
                                onClick={createOrder}
                            >
                                Checkout
                            </button>

                            <button className="clear-btn" onClick={clearCart}>
                                Clear Cart
                            </button>

                            {currentOrder && (
                                <button
                                    className="confirm-btn"
                                    onClick={confirmPayment}
                                >
                                    I Paid — Confirm
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
