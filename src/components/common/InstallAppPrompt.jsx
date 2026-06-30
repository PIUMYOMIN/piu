import React, { useEffect, useState } from "react";

function isIos() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

export default function InstallAppPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    if (isStandalone()) return undefined;

    const dismissed = sessionStorage.getItem("piu_install_prompt_dismissed");
    if (dismissed === "1") return undefined;

    if (isIos()) {
      setShowIosHint(true);
      setVisible(true);
      return undefined;
    }

    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("piu_install_prompt_dismissed", "1");
    setVisible(false);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    dismiss();
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[90] mx-auto max-w-lg rounded-xl border border-[#002147]/20 bg-white p-4 shadow-lg sm:left-auto sm:right-4">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900">Install PIU App</p>
          <p className="mt-1 text-sm text-gray-600">
            {showIosHint
              ? "Tap Share in Safari, then choose “Add to Home Screen” for quick access."
              : "Install this app on your device for faster access to admissions and your dashboard."}
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 text-gray-400 hover:text-gray-600"
          aria-label="Dismiss install prompt"
        >
          ×
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {!showIosHint && deferredPrompt && (
          <button
            type="button"
            onClick={install}
            className="rounded-lg bg-[#002147] px-4 py-2 text-sm font-medium text-white hover:bg-[#003366]"
          >
            Install app
          </button>
        )}
        <button
          type="button"
          onClick={dismiss}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
