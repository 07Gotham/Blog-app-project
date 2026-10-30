const API_URL = "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.token
        ? { Authorization: `Bearer ${options.token}` }
        : {}),
      ...options.headers
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export function registerUser(details) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(details)
  });
}

export function loginUser(details) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(details)
  });
}

export function getBlogs() {
  return request("/blogs");
}

export function getBlogsById(id) {
  return request("/blogs/${encodeURIComponent(id)}");
}

export function createBlog(blog, token) {
  return request("/blogs", {
    method: "POST",
    token,
    body: JSON.stringify(blog)
  });
}
