"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUserInfo, updateUser } from "@/lib/api";

export default function ProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [editData, setEditData] = useState({ first_name: "", last_name: "", is_active: false });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const userData = await getUserInfo(id, token);
        setUser(userData);
        setEditData({
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          is_active: userData.is_active || false,
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
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
      const updatedUser = await updateUser(id, token, editData);
      setUser(updatedUser);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded">
      <h1 className="text-xl font-bold mb-4">User Profile</h1>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={editData.first_name}
          onChange={handleChange}
          required
          className="w-full p-2 border"
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={editData.last_name}
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
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      {message && <p className="text-green-500 mt-2">{message}</p>}
      <button
        onClick={() => { localStorage.removeItem("access_token"); router.push("/login"); }}
        className="w-full mt-4 p-2 bg-red-500 text-white"
      >
        Log Out
      </button>
    </div>
  );
}
