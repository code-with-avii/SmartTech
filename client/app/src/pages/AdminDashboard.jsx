import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { API_URL } from "../Utils/config.js";
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  // State
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  // Forms
  const [newCatName, setNewCatName] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      fetchStats();
      fetchProducts();
      fetchCategories();
    }
  }, [user, navigate]);

  const token = localStorage.getItem("accessToken");
  const apiOptions = {
    withCredentials: true,
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/stats`,
        apiOptions,
      );
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/categories`,
        apiOptions,
      );
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Category Actions
  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_URL}/categories`,
        { name: newCatName },
        apiOptions,
      );
      setNewCatName("");
      fetchCategories();
    } catch (err) {
      setError("Failed to add category");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete category?")) return;
    try {
      await axios.delete(`${API_URL}/categories/${id}`, apiOptions);
      fetchCategories();
    } catch (err) {
      alert("Failed to delete category");
    }
  };

  // Product Actions
  const openNewProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      price: "",
      image: "",
      description: "",
      category: "",
    });
    setShowProductModal(true);
  };

  const openEditProductModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      price: prod.price || "",
      image: prod.image || "",
      description: prod.description || "",
      category: prod.category?._id || prod.category || "",
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(
          `${API_URL}/products/${editingProduct._id}`,
          productForm,
          apiOptions,
        );
        alert("Product updated");
      } else {
        await axios.post(
          `${API_URL}/products`,
          productForm,
          apiOptions,
        );
        alert("Product created");
      }
      setShowProductModal(false);
      fetchProducts();
      if (activeTab === "dashboard") fetchStats();
    } catch (err) {
      alert("Failed to save product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;
    try {
      await axios.delete(`${API_URL}/products/${id}`, apiOptions);
      fetchProducts();
      if (activeTab === "dashboard") fetchStats();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  if (!stats)
    return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      
      {/* Sidebar */}
      <div className="w-64 bg-linear-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-xl">
        <div className="p-6 text-2xl font-bold border-b border-gray-700 tracking-wide">
          ⚡ SmartAdmin
        </div>

        <nav className="flex flex-col gap-2 px-4 py-4">
          {[
            { name: "Dashboard", key: "dashboard", icon: "📊" },
            { name: "Products", key: "products", icon: "📦" },
            { name: "Categories", key: "categories", icon: "📁" },
            { name: "Users", key: "users", icon: "👤" }, // NEW
            { name: "Orders", key: "orders", icon: "🧾" },
             // NEW
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                activeTab === item.key
                  ? "bg-blue-600 shadow-md"
                  : "hover:bg-gray-700"
              }`}
            >
              <span>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>
      </div>
      
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
              Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">
                  Total Users
                </span>
                <span className="text-4xl font-black text-blue-600">
                  {stats.userCount}
                </span>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">
                  Total Products
                </span>
                <span className="text-4xl font-black text-green-600">
                  {stats.productCount}
                </span>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">
                  Total Orders
                </span>
                <span className="text-4xl font-black text-purple-600">
                  {stats.orderCount}
                </span>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">
                  Revenue
                </span>
                <span className="text-4xl font-black text-yellow-500">
                  ${stats.revenue}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Users */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                  Recent Users
                </h3>
                <ul className="divide-y divide-gray-100">
                  {stats.recentUsers.map((u) => (
                    <li
                      key={u._id}
                      className="py-3 flex justify-between items-center"
                    >
                      <span className="font-medium text-gray-700">
                        {u.name}
                      </span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {u.role}
                      </span>
                    </li>
                  ))}
                  {stats.recentUsers.length === 0 && (
                    <li className="py-3 text-gray-500 text-center">
                      No users found
                    </li>
                  )}
                </ul>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                  Recent Orders
                </h3>
                <ul className="divide-y divide-gray-100">
                  {stats.recentOrders.map((o) => (
                    <li
                      key={o._id}
                      className="py-3 flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium text-gray-700">
                          {o.user?.name || "Unknown User"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          ${o.totalAmount}
                        </div>
                        <div className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {o.status}
                        </div>
                      </div>
                    </li>
                  ))}
                  {stats.recentOrders.length === 0 && (
                    <li className="py-3 text-gray-500 text-center">
                      No orders found
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search products..."
            className="border px-4 py-2 rounded-lg w-1/3 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => {
              const value = e.target.value.toLowerCase();
              setProducts((prev) =>
                prev.filter((p) => p.name.toLowerCase().includes(value)),
              );
            }}
          />

          <select
            className="border px-3 py-2 rounded-lg"
            onChange={(e) => {
              const value = e.target.value;
              if (value === "all") fetchProducts();
              else
                setProducts(products.filter((p) => p.category?.name === value));
            }}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="animate-fade-in bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Product Management
              </h2>
              <button
                onClick={openNewProductModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
              >
                + Add Product
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <th className="p-4 font-semibold rounded-tl-lg">Image</th>
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Price</th>
                    <th className="p-4 font-semibold rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <tr
                      key={p._id || p.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <img
                          src={p.image}
                          onError={(e) => {
                            e.target.onError = null;
                            e.target.src =
                              "https://placehold.co/300x300.png?text=No+Image";
                          }}
                          alt={p.name}
                          className="w-12 h-12 object-contain rounded bg-white shadow-sm"
                        />
                      </td>
                      <td className="p-4 font-medium text-gray-800">
                        {p.name}
                      </td>
                      <td className="p-4 text-gray-600 text-sm">
                        <span className="bg-gray-100 px-2 py-1 rounded text-gray-600 font-medium">
                          {p.category?.name || "Uncategorized"}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-gray-800">
                        ${p.price}
                      </td>
                      <td className="p-4 flex gap-2 pt-6">
                        <button
                          onClick={() => openEditProductModal(p)}
                          className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id || p.id)}
                          className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Add New Category
              </h2>
              <form onSubmit={handleAddCategory} className="flex gap-3">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Category Name (e.g., Laptops)"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors"
                >
                  Save
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Existing Categories
              </h2>
              <ul className="divide-y divide-gray-100">
                {categories.map((c) => (
                  <li
                    key={c._id}
                    className="py-4 flex justify-between items-center group"
                  >
                    <span className="font-medium text-gray-700">{c.name}</span>
                    <button
                      onClick={() => handleDeleteCategory(c._id)}
                      className="text-red-500 opacity-0 group-hover:opacity-100 px-3 py-1 rounded hover:bg-red-50 transition-all text-sm font-medium"
                    >
                      Delete
                    </button>
                  </li>
                ))}
                {categories.length === 0 && (
                  <li className="py-8 text-center text-gray-500">
                    No categories found
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
        //users tab
        {activeTab === "users" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Users</h2>

            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.map((u) => (
                  <tr key={u._id} className="border-b">
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td className="text-blue-600">{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        //orders tab
        {activeTab === "orders" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Orders</h2>

            {stats.recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex justify-between border-b py-3"
              >
                <span>{order.user?.name}</span>
                <span>${order.totalAmount}</span>
                <span className="text-blue-600">{order.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden shadow-black/50">
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-gray-400 hover:text-gray-800 text-2xl transition-colors"
              >
                &times
              </button>
            </div>

            <form
              onSubmit={handleSaveProduct}
              className="p-6 flex flex-col gap-5"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  required
                  type="text"
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm({ ...productForm, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  placeholder="Nike Air Max"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                    placeholder="129.99"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white text-gray-700"
                  >
                    <option value="">No Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(e) =>
                    setProductForm({ ...productForm, image: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows="3"
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  placeholder="Product details..."
                ></textarea>
              </div>

              <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-5 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-colors text-shadow-sm"
                >
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
