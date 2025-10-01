import axios from "axios";
import SummaryApi, { baseUrl } from "../comman/summaryApi";

// Create Axios instance
const Axios = axios.create({
    baseURL: baseUrl,
    withCredentials: true, // send cookies if backend uses them
});

// Attach access token to each request
Axios.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken && !config.skipAuthRefresh) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle expired token automatically
Axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only retry once
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                const newAccessToken = await refreshAccessToken(refreshToken);
                if (newAccessToken) {
                    localStorage.setItem("accessToken", newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return Axios(originalRequest); // retry original request
                }
            }
        }

        return Promise.reject(error);
    }
);

const refreshAccessToken = async (refreshToken) => {
    try {
        // ✅ USE PLAIN AXIOS, NOT YOUR Axios INSTANCE
        const response = await axios({
            method: 'POST',
            url: `${baseUrl}/api/user/refresh-token`,
            data: { refreshToken }, // ✅ Send refresh token in body
            withCredentials: true,
        });

        const accessToken = response.data.data.accessToken;
        localStorage.setItem('accessToken', accessToken);
        return accessToken;
        
    } catch (err) {
        console.error("Refresh token failed:", err);
        // Clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return null;
    }
};

export default Axios;