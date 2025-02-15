"use client";

import type React from "react";

interface FullPageSpinnerProps {
  isLoading: boolean;
}

const LoadingComponent: React.FC<FullPageSpinnerProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div
        className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"
        style={{ color: "white" }}
      ></div>
    </div>
  );
};

export default LoadingComponent;
