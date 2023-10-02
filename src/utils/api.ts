import axios from "axios";
import router from "next/router";

const api = axios.create({
  // Set your API base URL here
  baseURL: "https://localhost:7061/api/",
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("intercepted");
      window.localStorage.removeItem("auth-token");
      router.push("/user");
    }
    return Promise.reject(error);
  }
);

export default api;
