import React from "react";

export default function LoadingSpinner() {
  return (
    <div>
      <div className="fixed top-0 left-0 z-50 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900" />
      </div>
    </div>
  );
}
