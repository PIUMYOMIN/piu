let loadPromise;
let readyPromise;

export function getRecaptchaSiteKey() {
  return import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";
}

export function isRecaptchaConfigured() {
  return Boolean(getRecaptchaSiteKey());
}

function canUseDom() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function waitForReady() {
  if (!canUseDom() || !window.grecaptcha || typeof window.grecaptcha.ready !== "function") {
    return Promise.resolve(false);
  }

  if (readyPromise) {
    return readyPromise;
  }

  readyPromise = new Promise((resolve) => {
    window.grecaptcha.ready(() => resolve(true));
  });

  return readyPromise;
}

function attachScriptListeners(script, resolve) {
  const handleLoad = async () => {
    const ready = await waitForReady();
    resolve(ready);
  };

  const handleError = () => {
    loadPromise = null;
    readyPromise = null;
    resolve(false);
  };

  script.addEventListener("load", handleLoad, { once: true });
  script.addEventListener("error", handleError, { once: true });
}

export function prepareRecaptcha() {
  const siteKey = getRecaptchaSiteKey();
  if (!siteKey || !canUseDom()) {
    return Promise.resolve(false);
  }

  if (window.grecaptcha && typeof window.grecaptcha.execute === "function") {
    return waitForReady();
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve) => {
    const existing =
      document.querySelector('script[data-recaptcha-v3="true"]') ||
      document.querySelector(`script[src*="recaptcha/api.js?render=${encodeURIComponent(siteKey)}"]`);

    if (existing) {
      if (window.grecaptcha) {
        waitForReady().then(resolve);
        return;
      }
      attachScriptListeners(existing, resolve);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.defer = true;
    script.dataset.recaptchaV3 = "true";
    attachScriptListeners(script, resolve);
    document.head.appendChild(script);
  });

  return loadPromise;
}

function normalizeAction(action) {
  return String(action || "submit")
    .replace(/[^a-zA-Z0-9/_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 100);
}

export async function executeRecaptcha(action) {
  if (!isRecaptchaConfigured()) {
    return null;
  }

  const loaded = await prepareRecaptcha();
  if (!loaded || !window.grecaptcha || typeof window.grecaptcha.execute !== "function") {
    return null;
  }

  try {
    return await window.grecaptcha.execute(getRecaptchaSiteKey(), {
      action: normalizeAction(action),
    });
  } catch (error) {
    console.error("reCAPTCHA execution failed:", error);
    return null;
  }
}
