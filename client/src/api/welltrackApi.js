const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.error || data.errors?.join(" ") || "Request failed.";
    throw new Error(message);
  }

  return data;
}

export function registerUser(payload) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getProfile(token) {
  return request("/api/auth/profile", { token });
}

export function getHabits(token, params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/api/habits${query ? `?${query}` : ""}`, { token });
}

export function getWellnessSummary(token) {
  return request("/api/habits/summary", { token });
}

export function createHabit(token, payload) {
  return request("/api/habits", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function updateHabit(token, id, payload) {
  return request(`/api/habits/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteHabit(token, id) {
  return request(`/api/habits/${id}`, {
    method: "DELETE",
    token,
  });
}

export function getEntries(token, params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/api/entries${query ? `?${query}` : ""}`, { token });
}

export function createEntry(token, payload) {
  return request("/api/entries", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function updateEntry(token, id, payload) {
  return request(`/api/entries/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteEntry(token, id) {
  return request(`/api/entries/${id}`, {
    method: "DELETE",
    token,
  });
}
