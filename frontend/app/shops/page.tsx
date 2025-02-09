"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getActiveShops } from "@/lib/api";

export default function ShopsPage() {
  const router = useRouter();
  const [shops, setShops] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const shopList = await getActiveShops();
        setShops(shopList);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchShops();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!shops.length) return <p>Loading active shops...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-5">
      <h1 className="text-2xl font-bold mb-4">Active Shops</h1>
      <div className="grid gap-4">
        {shops.map((shop) => (
          <div key={shop.id} className="p-4 border rounded">
            <h2 className="text-lg font-bold">{shop.name || `Shop #${shop.id}`}</h2>
            <button
              onClick={() => router.push(`/shops/${shop.id}`)}
              className="mt-2 p-2 bg-blue-500 text-white rounded"
            >
              View Shop
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
