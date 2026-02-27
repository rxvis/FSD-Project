const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const apiRequest = async (path, options = {}) => {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch {
    throw new Error("Cannot reach backend API. Start/restart `npm run server`.");
  }

  let payload = {};
  let rawText = "";
  try {
    payload = await response.json();
  } catch {
    try {
      rawText = await response.text();
    } catch {
      rawText = "";
    }
  }

  if (!response.ok) {
    if ((response.status === 500 || response.status === 502 || response.status === 503) && !payload.message && !rawText) {
      throw new Error("Backend API is unavailable. Start/restart `npm run server`.");
    }
    const fallback = rawText ? rawText.slice(0, 120) : "";
    throw new Error(payload.message || fallback || `Request failed (${response.status})`);
  }

  return payload;
};

export { apiRequest };
