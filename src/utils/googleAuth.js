let loadPromise;
let initializedClientId = null;
let activeCredentialHandler = null;

export function getGoogleClientId() {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
}

export function isGoogleAuthConfigured() {
  return Boolean(getGoogleClientId());
}

function canUseDom() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

export function loadGoogleIdentityScript() {
  const clientId = getGoogleClientId();
  if (!clientId || !canUseDom()) {
    return Promise.resolve(false);
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve(true);
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve) => {
    const existing = document.querySelector('script[data-google-identity="true"]');

    const handleReady = () => resolve(Boolean(window.google?.accounts?.id));
    const handleError = () => {
      loadPromise = null;
      resolve(false);
    };

    if (existing) {
      if (window.google?.accounts?.id) {
        resolve(true);
        return;
      }
      existing.addEventListener("load", handleReady, { once: true });
      existing.addEventListener("error", handleError, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = "true";
    script.addEventListener("load", handleReady, { once: true });
    script.addEventListener("error", handleError, { once: true });
    document.head.appendChild(script);
  });

  return loadPromise;
}

function ensureGoogleInitialized(clientId) {
  if (initializedClientId === clientId) {
    return true;
  }

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => {
      activeCredentialHandler?.(response);
    },
    auto_select: false,
    cancel_on_tap_outside: true,
    use_fedcm_for_prompt: false,
  });

  initializedClientId = clientId;
  return true;
}

export async function renderGoogleSignInButton(container, options = {}) {
  const {
    callback,
    theme = "outline",
    size = "large",
    text = "continue_with",
    width,
  } = options;

  if (!container || typeof callback !== "function") {
    return false;
  }

  const loaded = await loadGoogleIdentityScript();
  if (!loaded) {
    return false;
  }

  const clientId = getGoogleClientId();
  activeCredentialHandler = (response) => {
    callback(response);
  };

  ensureGoogleInitialized(clientId);
  container.innerHTML = "";

  window.google.accounts.id.renderButton(container, {
    theme,
    size,
    text,
    width: width || container.offsetWidth || 320,
    shape: "rectangular",
  });

  return true;
}

export function warmGoogleAuth() {
  return loadGoogleIdentityScript();
}
