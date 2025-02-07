"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData);
      localStorage.setItem("access_token", data.access_token);

      const tokenParts = data.access_token.split(".");
      const decodedToken = JSON.parse(atob(tokenParts[1]));

      const userId = decodedToken.user_id;
      console.log("User ID:", userId);

      router.push(`/users/${userId}`);
    } catch (err) {
        setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="username" placeholder="Username or Email" value={formData.username} onChange={handleChange} required className="w-full p-2 border" />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full p-2 border" />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white">Увійти</button>
      </form>
    </div>
  );
}
