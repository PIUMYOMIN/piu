import React, { useEffect, useRef, useState } from "react";
import { isGoogleAuthConfigured, renderGoogleSignInButton } from "../../utils/googleAuth";

export default function GoogleSignInButton({ onCredential, onError, disabled = false }) {
  const buttonRef = useRef(null);
  const onCredentialRef = useRef(onCredential);
  const onErrorRef = useRef(onError);
  const [unavailable, setUnavailable] = useState(!isGoogleAuthConfigured());

  onCredentialRef.current = onCredential;
  onErrorRef.current = onError;

  useEffect(() => {
    if (disabled || !isGoogleAuthConfigured() || !buttonRef.current) {
      setUnavailable(!isGoogleAuthConfigured());
      return undefined;
    }

    let cancelled = false;

    renderGoogleSignInButton(buttonRef.current, {
      callback: (response) => {
        if (response?.credential) {
          onCredentialRef.current?.(response.credential);
          return;
        }
        onErrorRef.current?.(new Error("Google sign-in was cancelled."));
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
  }, [disabled]);

  if (unavailable) {
    return (
      <p className="text-center text-sm text-gray-500">
        Google sign-in is not configured for this environment.
      </p>
    );
  }

  return <div ref={buttonRef} className="w-full flex justify-center min-h-[44px]" />;
}
