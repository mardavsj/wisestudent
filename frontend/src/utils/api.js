import axios from "axios";

// 🌐 Set the base URL from .env or fallback to localhost
// In production, this should be set to your production API URL (e.g., https://api.wisestudent.org)
const baseURL = import.meta.env.VITE_API_URL?.trim() || "http://localhost:5000";

// Only log API URL in development (never in production)
if (import.meta.env.DEV) {
  console.log('🔧 API Base URL:', baseURL);
}

// ✅ Create an Axios instance
const api = axios.create({
  baseURL,
  withCredentials: true, // Enables cookies for cross-origin requests
});

// 🔄 Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.message || error.message || "Unknown error";
    console.error("🔴 API Error:", msg);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const publicPaths = ['/', '/institution-type', '/individual-account', '/register-stakeholder', '/register-parent', '/register-seller', '/register-teacher', '/school-registration', '/choose-account-type'];
      
      // Only logout/redirect for auth endpoint failures, not data endpoint failures
      // Data endpoints might return 401 for missing permissions, which shouldn't trigger logout
      const isAuthEndpoint = error.config?.url?.includes('/api/auth/');
      
      // Only redirect if:
      // 1. It's an auth endpoint failure (like /api/auth/me)
      // 2. Not already on login/register page
      // 3. Not on public paths
      if (isAuthEndpoint && !currentPath.includes('/login') && !currentPath.includes('/register') && !publicPaths.includes(currentPath)) {
        console.warn("🔐 Authentication failed. Clearing token and redirecting to login.");
        
        // Clear invalid token
        localStorage.removeItem("finmen_token");
        
        // Clear any other auth-related storage
        try {
          // Clear session cookies
          document.cookie.split(";").forEach(c => {
            document.cookie = c
              .replace(/^ +/, "")
              .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
          });
        } catch (e) {
          console.error("Error clearing cookies:", e);
        }
        
        // Redirect to login after a short delay to prevent multiple redirects
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
      } else if (!isAuthEndpoint) {
        // For non-auth endpoints, just log the error but don't logout
        // This allows CSR dashboard to handle the error gracefully
        console.warn("⚠️ API request failed (401):", error.config?.url);
      } else {
        // On public/auth pages, just clear token without redirecting
        localStorage.removeItem("finmen_token");
      }
    }
    
    return Promise.reject(error);
  }
);

// 🔐 Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("finmen_token");

    // Only log in development (never expose token info in production)
    if (import.meta.env.DEV) {
      console.log('🔐 API Request interceptor:', {
        url: config.url,
        method: config.method,
        hasToken: !!token,
        tokenLength: token ? token.length : 0
      });
    }

    if (token) {
      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          // Check if token is expired (basic check)
          try {
            const payload = JSON.parse(atob(parts[1]));
            const currentTime = Date.now() / 1000;
            
            if (payload.exp && payload.exp < currentTime) {
              console.warn("⚠️ Token expired. Removing...");
              localStorage.removeItem("finmen_token");
              return config;
            }
          } catch {
            console.warn("⚠️ Could not parse token payload");
          }
          
          config.headers.Authorization = `Bearer ${token}`;
          
          // Only log in development
          if (import.meta.env.DEV) {
            console.log('✅ Token added to request headers');
          }
        } else {
          console.warn("⚠️ Malformed token found. Removing...");
          localStorage.removeItem("finmen_token");
        }
      } catch (err) {
        console.error("❌ Token parsing error:", err.message);
        localStorage.removeItem("finmen_token");
      }
    } else {
      // ✅ Added from stash - Only log warning for protected routes, not public pages
      const publicPaths = ['/register-parent', '/register-stakeholder', '/register-seller', '/register-teacher', '/school-registration', '/login', '/'];
      const currentPath = window.location.pathname;
      if (!publicPaths.some(path => currentPath.includes(path))) {
        console.warn("⚠️ No token found in localStorage");
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
