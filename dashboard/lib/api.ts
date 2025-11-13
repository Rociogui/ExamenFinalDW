// API Configuration
const API_BASE_A = process.env.NEXT_PUBLIC_API_A || "http://localhost:8080/api";
const API_BASE_B = process.env.NEXT_PUBLIC_API_B || "http://localhost:8081/api";

export { API_BASE_A, API_BASE_B };

// Helper function to make API calls with better error handling
export async function fetchAPI(url: string, options?: RequestInit) {
  try {
    console.log(`[API] Llamando a: ${url} con método: ${options?.method || "GET"}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    console.log(`[API] Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] Error response body:`, errorText);
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const responseText = await response.text();
    console.log(`[API] Response text:`, responseText);
    
    // Parse JSON de manera segura
    if (!responseText) {
      return null;
    }
    
    try {
      const data = JSON.parse(responseText);
      console.log(`[API] Response data:`, data);
      return data;
    } catch (jsonError) {
      console.error("[API] Error parsing JSON:", jsonError);
      // Si falla el parsing, devolvemos el texto como está
      return responseText;
    }
  } catch (error) {
    console.error("[API] Fetch error:", error);
    throw error;
  }
}
