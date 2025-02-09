"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getShopInfo, updateShop } from "@/lib/api";

export default function ShopPage() {
  const { id } = useParams();
  const router = useRouter();
  const [shop, setShop] = useState(null);
  const [error, setError] = useState("");
  const [editData, setEditData] = useState({ name: "", is_active: false });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchShop = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const shopData = await getShopInfo(id, token);
        setShop(shopData);
        setEditData({
          name: shopData.name || "",
          is_active: shopData.is_active || false,
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchShop();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEditData({
      ...editData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("access_token");
      const updatedShop = await updateShop(id, token, editData);
      setShop(updatedShop);
      setMessage("Shop updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!shop) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded">
      <h1 className="text-xl font-bold mb-4">Shop Info</h1>
      <p><strong>Shop ID:</strong> {shop.id}</p>
      <p><strong>Owner ID:</strong> {shop.user_id}</p>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <input
          type="text"
          name="name"
          placeholder="Shop Name"
          value={editData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="is_active"
            checked={editData.is_active}
            onChange={handleChange}
          />
          <span>Active</span>
        </label>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Shop"}
        </button>
      </form>

      {message && <p className="text-green-500 mt-2">{message}</p>}

      {/* Button to return to user profile */}
      <button
        onClick={() => router.push(`/users/${shop.user_id}`)}
        className="w-full mt-4 p-2 bg-gray-500 text-white"
      >
        Back to Profile
      </button>
    </div>
  );
}
