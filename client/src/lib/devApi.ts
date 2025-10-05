// Dev-only API helper for saving JSON files and uploading images
// Only works in development mode on Replit

const DEV_TOKEN = import.meta.env.VITE_LOCAL_ADMIN_TOKEN;

export async function saveToJson<T>(filename: string, data: T[]): Promise<void> {
  if (!import.meta.env.DEV) {
    throw new Error("Dev API only available in development mode");
  }

  const response = await fetch("/dev/save-json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": DEV_TOKEN || "",
    },
    body: JSON.stringify({
      file: filename,
      content: data,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || "Failed to save data");
  }

  return response.json();
}

export async function uploadImage(file: File): Promise<string> {
  if (!import.meta.env.DEV) {
    throw new Error("Dev API only available in development mode");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/dev/upload", {
    method: "POST",
    headers: {
      "x-admin-token": DEV_TOKEN || "",
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || "Failed to upload image");
  }

  const result = await response.json();
  return result.publicPath;
}

// Helper to load JSON data from static files
export async function loadJsonData<T>(filename: string): Promise<T[]> {
  const response = await fetch(`/data/${filename}`);
  if (!response.ok) {
    throw new Error(`Failed to load ${filename}`);
  }
  return response.json();
}
