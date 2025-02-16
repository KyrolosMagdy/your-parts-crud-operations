"use client";

import type React from "react";
import { useEffect } from "react";
import { X } from "lucide-react";

interface SnackbarProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: "success" | "error";
}

const Snackbar: React.FC<SnackbarProps> = ({
  message,
  isVisible,
  onClose,
  type = "success",
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 9000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = type === "success" ? "!bg-green-500" : "!bg-red-500";

  return (
    <div
      data-testid="snackbar"
      className={`fixed bottom-4 right-4 ${bgColor} !text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300`}
    >
      <div className="flex justify-between items-center">
        <span style={{ color: "white" }}>{message}</span>
        <button
          onClick={onClose}
          style={{ color: "white" }}
          className={`ml-2 p-1 hover:${
            type === "success" ? "bg-green-600" : "bg-red-600"
          } rounded-full transition-colors duration-200`}
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Snackbar;
