// axiosInstance.js
import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';


// Token refresh control variables
let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

// Function to subscribe requests to the token refresh process
const subscribeTokenRefresh = (callback: () => void) => {
    refreshSubscribers.push(callback);
};

// Function to notify all subscribers when the token is refreshed
const onRefreshed = () => {
    console.log('pending requests running after refresh', refreshSubscribers.map(req => req.toString()));
    refreshSubscribers.forEach((callback) => callback());       // running all the requests one by one
    refreshSubscribers = []; // Clear the subscribers after notifying
};

const axiosInstance = axios.create({
    baseURL: 'http://localhost:9000',
    withCredentials: true, // This ensures cookies are sent with requests
});


// If any request returns 401 response, interceptor tries to refresh the access token,
//  when the token is being refreshed all the requests triggered are stored in refreshSubscribers array, 
// once the refresh is completed all the requests stored in refreshSubscribers are triggered

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {

        if (error.config !== undefined) {
            const originalRequest: InternalAxiosRequestConfig & { _retry?: boolean } = error.config;
            console.log('original request');

            if (error.response?.status === 401 && !originalRequest._retry) {
                console.log('request failed with 401, retry = true');
                // Mark the request as retried to avoid infinite loops
                originalRequest._retry = true;

                // Ensure we don't retry the refresh token request itself
                if (originalRequest.url?.includes('/auth/refresh-access-token')) {
                    console.error('Refresh token is invalid. Redirecting to login.');
                    return Promise.reject(error); // Stop further retries
                }

                if (!isRefreshing) {

                    console.log('refreshing the access token triggered by originalRequest', originalRequest.url);

                    isRefreshing = true;

                    try {
                        // Request to refresh the token
                        const refreshResponse = await axios.post(
                            'http://localhost:9000/auth/refresh-access-token',
                            {},
                            { withCredentials: true } // Include cookies
                        );
                        onRefreshed();      //token has been refreshed, now run all the waiting requests 
                    }
                    catch (refreshError) {
                        console.error('Failed to refresh token:', refreshError);

                        // Optionally redirect to login
                        return Promise.reject(refreshError);
                    } finally {
                        isRefreshing = false;
                    }
                }
                // Wait for the token to be refreshed
                return new Promise((resolve) => {
                    console.log('adding failed request to subscribeTokenRefresh');
                    subscribeTokenRefresh(() => {
                        // Retry the original request
                        console.log('token refreshed, now going to retry request', originalRequest.url);
                        resolve(axiosInstance(originalRequest));
                    });
                });
            }
        }
        // Reject the error if it's not a 401 or if the request has already been retried
        return Promise.reject(error);
    }
)

export default axiosInstance;