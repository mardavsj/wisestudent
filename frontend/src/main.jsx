import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { toast } from "react-hot-toast";

import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import { WalletProvider } from "./context/WalletContext";
import { NotificationProvider } from "./context/NotificationContext";
import { SocketProvider } from "./context/SocketContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";

// Register Service Worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("✅ Service Worker registered:", registration.scope);
      })
      .catch((error) => {
        console.error("❌ Service Worker registration failed:", error);
      });
  });
}

// Capture beforeinstallprompt event early (before React components mount)
// This ensures we don't miss the event if it fires before the InstallPWA component loads
window.addEventListener("beforeinstallprompt", (e) => {
  console.log("🔔 beforeinstallprompt event captured globally");
  e.preventDefault();
  // Store globally so InstallPWA component can access it
  window.deferredInstallPrompt = e;
});

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const IGNORED_TOAST_MESSAGES = new Set(["Recommendations updated!"]);
const sanitizeToastMessage = (message) => {
  if (typeof message === "string") {
    return message;
  }
  if (typeof message === "function") {
    try {
      return message();
    } catch {
      return "";
    }
  }
  return message?.toString?.() ?? "";
};

const shouldBlockToast = (message) => {
  const text = sanitizeToastMessage(message);
  return IGNORED_TOAST_MESSAGES.has(text);
};

const wrapToastFn = (fn) => (message, ...rest) => {
  if (shouldBlockToast(message)) {
    return { id: "__blocked_toast__" };
  }
  return fn(message, ...rest);
};

toast.success = wrapToastFn(toast.success);
toast.error = wrapToastFn(toast.error);
toast.loading = wrapToastFn(toast.loading);

// Development warning about Google OAuth configuration
if (import.meta.env.DEV && !googleClientId) {
  console.warn("⚠️ VITE_GOOGLE_CLIENT_ID is not set. Google OAuth will not work.");
} else if (import.meta.env.PROD && googleClientId) {
  // Production reminder about redirect URI configuration
  const currentOrigin = window.location.origin;
  console.log(`🔐 Google OAuth configured for: ${currentOrigin}`);
  console.log(`📝 Ensure ${currentOrigin} is added to Authorized JavaScript origins in Google Cloud Console`);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <WalletProvider>
          <NotificationProvider>
            <SocketProvider>
              <SubscriptionProvider>
                <App />
              </SubscriptionProvider>
            </SocketProvider>
          </NotificationProvider>
        </WalletProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>
);
