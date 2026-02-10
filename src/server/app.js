const API_URL = "http://localhost:3001";

export const api = {
  async get(resource, params = "") {
    let url = `${API_URL}/${resource}`;
    const response = await fetch(url);
    if (!response.ok) {
      const error = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${error || response.statusText}`,
      );
    }
    let data = await response.json();
    if (typeof params === "object") {
      const entries = Object.entries(params);
      entries.forEach(([key, entry]) => {
        switch (key) {
          case "filterBy": {
            data = data.filter((item) => item[entry.key] === entry.value);
            break;
          }
          default:
            break;
        }
      });
    }

    return data;
  },
  async post(resource, data) {
    const response = await fetch(`${API_URL}/${resource}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  },
  async postMany(resource, data) {
    const responses = await Promise.all(
      data.map((item) =>
        fetch(`${API_URL}/${resource}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        }),
      ),
    );

    const results = await Promise.all(
      responses.map((response) => response.json()),
    );

    return results;
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
  async deleteMany(resource, ids) {
    await Promise.all(
      ids.map((id) =>
        fetch(`${API_URL}/${resource}/${id}`, {
          method: "DELETE",
        }),
      ),
    );
  },
};
