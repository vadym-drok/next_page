import { useRouter } from "next/navigation";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error("Registration failed");
    }

    return response.json();
};

export const loginUser = async (credentials) => {
    const formData = new URLSearchParams();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail);
    }

    return response.json();
};

export const getUserInfo = async (id: string, token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}/`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
    });

    if (!response.ok) {
        if (response.status === 401) {
            const router = useRouter(); // Use Next.js router
            localStorage.removeItem("access_token");
            router.push("/login");
            throw new Error("Session expired. Please log in again.");
        }

        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch user data");
    }

    return response.json();
};


export const updateUser = async (id: string, token: string, userData: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}/edit`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update user data");
    }

    return response.json();
};


export const getShopInfo = async (id: string, token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shops/${id}/`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch shop data");
    }

    return response.json();
};

export const updateShop = async (id: string, token: string, shopData: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shops/${id}/edit`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(shopData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update shop");
    }

    return response.json();
};


export const getActiveShops = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shops`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch shops");
    }

    return response.json();
};
