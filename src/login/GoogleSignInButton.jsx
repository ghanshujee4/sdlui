import { useEffect, useRef } from "react";
import config from "config";
import { loadGoogleIdentityScript } from "utils/googleAuth";

/**
 * Renders Google's "Continue with Google" button (sign-in + sign-up).
 * Requires REACT_APP_GOOGLE_CLIENT_ID in .env
 */
const GoogleSignInButton = ({ onCredential, onError, disabled = false }) => {
  const containerRef = useRef(null);
  const clientId = config.GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || disabled || !containerRef.current) return;

    let cancelled = false;
    const host = containerRef.current;

    const handleCredential = (response) => {
      if (response?.credential) {
        onCredential?.(response.credential);
      } else {
        onError?.(new Error("No credential returned from Google"));
      }
    };

    const mountButton = async () => {
      try {
        await loadGoogleIdentityScript();
        if (cancelled || !host) return;

        host.innerHTML = "";
        const buttonEl = document.createElement("div");
        buttonEl.className = "login-google-native-btn";
        host.appendChild(buttonEl);

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredential,
          context: "signup",
          ux_mode: "popup",
        });

        window.google.accounts.id.renderButton(buttonEl, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "left",
          width: Math.min(host.offsetWidth || 380, 400),
        });
      } catch (err) {
        onError?.(err);
      }
    };

    mountButton();

    return () => {
      cancelled = true;
      host.innerHTML = "";
    };
  }, [clientId, disabled, onCredential, onError]);

  if (!clientId) {
    return (
      <p className="login-google-hint text-muted small mb-0">
        Google sign-in: add <code>REACT_APP_GOOGLE_CLIENT_ID</code> to your{" "}
        <code>.env</code> file.
      </p>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`login-google-btn-wrap ${disabled ? "login-google-btn-wrap--disabled" : ""}`}
      aria-hidden={disabled}
    />
  );
};

export default GoogleSignInButton;
