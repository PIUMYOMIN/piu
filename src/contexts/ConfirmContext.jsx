import React, { createContext, useCallback, useContext, useState } from "react";
const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null);

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      setDialog({
        title: options.title || "Are you sure?",
        message: options.message || "This action cannot be undone.",
        confirmLabel: options.confirmLabel || "Confirm",
        cancelLabel: options.cancelLabel || "Cancel",
        tone: options.tone || "danger",
        resolve,
      });
    });
  }, []);

  const close = (result) => {
    dialog?.resolve(result);
    setDialog(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {dialog && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
        >
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="border-b border-gray-100 px-5 py-4">
              <h3 id="confirm-dialog-title" className="text-lg font-semibold text-gray-900">
                {dialog.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">{dialog.message}</p>
            </div>
            <div className="flex flex-col-reverse gap-2 px-5 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => close(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {dialog.cancelLabel}
              </button>
              <button
                type="button"
                onClick={() => close(true)}
                className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                  dialog.tone === "danger"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-[#002147] hover:bg-[#003366]"
                }`}
              >
                {dialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return ctx.confirm;
}

/** Standard delete confirmation modal */
export async function confirmDelete(confirm, { itemName, itemType = "item" } = {}) {
  const label = itemName ? `"${itemName}"` : `this ${itemType}`;
  return confirm({
    title: "Confirm deletion",
    message: `Are you sure you want to delete ${label}?\n\nThis action cannot be undone.`,
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
    tone: "danger",
  });
}

export function useConfirmDelete() {
  const confirm = useConfirm();
  return useCallback((options = {}) => confirmDelete(confirm, options), [confirm]);
}
