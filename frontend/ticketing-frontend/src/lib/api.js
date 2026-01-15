const API_BASE_URL = "http://localhost:8080";

export async function apiRequest(
  url,
  method = "GET",
  body = null,
  auth = null
) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (auth) {
    headers["Authorization"] =
      "Basic " + window.btoa(auth.username + ":" + auth.password);

  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    throw new Error("Request failed");
  }

  return response.json().catch(() => ({}));
}
