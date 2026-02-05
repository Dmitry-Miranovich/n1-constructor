const API_URL = "http://localhost:3001";

export const api = {
  async get(resource, params = "") {
    const response = await fetch(`${API_URL}/${resource}${params}`);
    if (!response.ok) throw new Error("Network error");
    return await response.json();
  },
  async post(resource, data) {
    const response = await fetch(`${API_URL}/${resource}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  },
  async update(resource, id, data, method = "PUT") {
    const response = await fetch(`${API_URL}/${resource}/${id}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  },
  async delete(resource, id) {
    await fetch(`${API_URL}/${resource}/${id}`, {
      method: "DELETE",
    });
  },
};
