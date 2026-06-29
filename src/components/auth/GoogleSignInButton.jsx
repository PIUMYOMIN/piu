import React, { useEffect, useRef, useState } from "react";
import { isGoogleAuthConfigured, renderGoogleSignInButton } from "../../utils/googleAuth";

export default function GoogleSignInButton({ onCredential, onError, disabled = false }) {
  const buttonRef = useRef(null);
  const [unavailable, setUnavailable] = useState(!isGoogleAuthConfigured());

  useEffect(() => {
    if (disabled || !isGoogleAuthConfigured() || !buttonRef.current) {
      setUnavailable(!isGoogleAuthConfigured());
      return undefined;
    }

    let cancelled = false;

    renderGoogleSignInButton(buttonRef.current, {
      callback: (response) => {
        if (response?.credential) {
          onCredential(response.credential);
          return;
        }

        onError?.(new Error("Google sign-in was cancelled."));
      },
      width: buttonRef.current.offsetWidth || 320,
    }).then((ready) => {
      if (!cancelled) {
        setUnavailable(!ready);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [disabled, onCredential, onError]);

  if (unavailable) {
    return null;
  }

  return <div ref={buttonRef} className="w-full flex justify-center min-h-[44px]" />;
}
