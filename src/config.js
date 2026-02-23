const config = {
  BASE_URL: process.env.REACT_APP_BASE_URL || "http://localhost:8080/api",
  BASE_ENV: process.env.REACT_APP_BASE_ENV || "http://localhost:8080",
  BASE_API_ROOT: process.env.REACT_APP_BASE_API_ROOT || "http://localhost:8080/api",
  ENV_FRONT: process.env.REACT_APP_ENV_FRONT || "http://localhost:3000",
 };

export default config;


  // BASE_API_ROOT: "https://api.shastradigitallibrary.com/api",
  // BASE_URL:"https://api.shastradigitallibrary.com/api",
  // BASE_ENV:"https://api.shastradigitallibrary.com",
  //  BASE_API_ROOT: "http://localhost:8080/api",
  // BASE_URL:"http://localhost:8080/api",
  // BASE_ENV:"http://localhost:8080",