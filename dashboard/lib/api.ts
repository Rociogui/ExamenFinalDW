// API Configuration
const API_BASE_A = process.env.NEXT_PUBLIC_API_A || "http://localhost:8080/api";
const API_BASE_B = process.env.NEXT_PUBLIC_API_B || "http://localhost:8081/api";

export { API_BASE_A, API_BASE_B };

// Helper function to make API calls
export async function fetchAPI(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
