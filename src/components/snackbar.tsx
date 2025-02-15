"use client";

import type React from "react";
import { useEffect } from "react";
import { X } from "lucide-react";

interface SnackbarProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 9000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300">
      <div
        className="flex justify-between items-center"
        style={{ color: "white" }}
      >
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 p-1 hover:bg-green-600 rounded-full transition-colors duration-200"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Snackbar;
