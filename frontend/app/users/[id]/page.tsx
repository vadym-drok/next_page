"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUserInfo } from "@/lib/api";

export default function ProfilePage({params}: {params: {id: string}} ) {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

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
      } catch (err) {
        setError(err);
      }
    };

    fetchUser();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>Load...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded">
      <h1 className="text-xl font-bold mb-4">User data</h1>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <button onClick={() => { localStorage.removeItem("access_token"); router.push("/login"); }} className="w-full mt-4 p-2 bg-red-500 text-white">
        LogOut
      </button>
    </div>
  );
}
