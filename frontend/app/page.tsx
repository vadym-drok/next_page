"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setUserId(decodedToken.user_id);
      } catch (error) {
        localStorage.removeItem("access_token");
      }
    }
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-5">
      <h1 className="text-2xl font-bold mb-4">Home</h1>

      {userId ? (
        <button
          onClick={() => router.push(`/users/${userId}`)}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Edit Profile
        </button>
      ) : (
        <div className="flex space-x-2">
          <button onClick={() => router.push("/login")} className="p-2 border rounded">
            LogIn
          </button>
          <button onClick={() => router.push("/register")} className="p-2 border rounded">
            Registration
          </button>
        </div>
      )}
    </div>
  );
}

