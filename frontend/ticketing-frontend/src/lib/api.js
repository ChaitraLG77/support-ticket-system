const API_BASE_URL = "http://localhost:8080";

export async function apiRequest(
  url,
  method = "GET",
  body = null
) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  console.log(`Making ${method} request to ${API_BASE_URL}${url}`);
  console.log('Headers:', headers);
  console.log('Body:', body);

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(errorText || "Request failed");
    }

    return response.json().catch(() => ({}));
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

