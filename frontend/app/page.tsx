"use client";

import { useRouter } from "next/navigation";


export default function Home() {
    const router = useRouter();
  return (
    <div className="">
      <h1>Home</h1>
      <button onClick={() => { router.push("/login"); }} className="w-full mt-4 p-2 bg-red-500 text-white">
        LogIn
      </button>
        <button onClick={() => { router.push("/register"); }} className="w-full mt-4 p-2 bg-red-500 text-white">
        Registration
      </button>
    </div>
  );
}
