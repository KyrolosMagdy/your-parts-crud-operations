"use client";

import { Post } from "@/services/api";
import type React from "react";
import { useEffect } from "react";

interface FullPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post; // Replace 'any' with the actual post type
}

const FullPostModal: React.FC<FullPostModalProps> = ({
  isOpen,
  onClose,
  post,
}) => {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        data-testid="modal-overlay"
        onClick={onClose}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          position: "absolute",
          overflowY: "hidden",
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          zIndex: 10,
        }}
      ></div>
      <div
        style={{
          backgroundColor: "white",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          zIndex: 11,
        }}
      >
        <h1>{post.title}</h1>
        <p>{post.body}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </>
  );
};

export default FullPostModal;
