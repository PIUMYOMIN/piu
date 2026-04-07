let loadPromise;

function getSiteKey() {
  return import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';
}

function ensureScriptLoaded() {
  const siteKey = getSiteKey();
  if (!siteKey) return Promise.resolve(false);
  if (typeof window === 'undefined' || typeof document === 'undefined') return Promise.resolve(false);

  if (window.grecaptcha && window.grecaptcha.execute) return Promise.resolve(true);

  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve) => {
    const existing = document.querySelector('script[data-recaptcha-v3="true"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.defer = true;
    script.dataset.recaptchaV3 = 'true';
    script.addEventListener('load', () => resolve(true));
    script.addEventListener('error', () => resolve(false));
    document.head.appendChild(script);
  });

  return loadPromise;
}

export async function executeRecaptcha(action) {
  const siteKey = getSiteKey();
  if (!siteKey) return null;

  const ok = await ensureScriptLoaded();
  if (!ok) return null;

  if (!window.grecaptcha || !window.grecaptcha.execute) return null;

  return await window.grecaptcha.execute(siteKey, { action });
}

