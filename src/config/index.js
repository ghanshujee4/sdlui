const config = {
  BASE_URL: process.env.REACT_APP_BASE_URL || "http://localhost:8080/api",
  BASE_ENV: process.env.REACT_APP_BASE_ENV || "http://localhost:8080",
  BASE_API_ROOT:
    process.env.REACT_APP_BASE_API_ROOT || "http://localhost:8080/api",
  ENV_FRONT: process.env.REACT_APP_ENV_FRONT || "http://localhost:3000",
  GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID || "",
};

export default config;
