async function request(endpoint, options = {}) {
  const url = `${endpoint}`;
  const config = {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  };
  const res = await fetch(url, config);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, body) =>
    request(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: (endpoint, body) =>
    request(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: "DELETE" }),
};
