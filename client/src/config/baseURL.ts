// client/src/config/baseUrl.ts

let baseUrl: string = "";

// Use import.meta.env.MODE for Vite environments
if (import.meta.env.MODE === "development") {
  // The URL for your local backend server
  baseUrl = "http://localhost:5000";
} else {
  // The URL for your deployed backend on Render
  baseUrl = "https://note-app-server-852b.onrender.com";
}

export default baseUrl;
