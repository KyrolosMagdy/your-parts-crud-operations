"use client";

import type React from "react";

import Link from "next/link";
import { FileText, Home, Menu, Users, X } from "lucide-react";
import { useState } from "react";

const AppBar: React.FC = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <nav
      className="bg-blue-600 text-white p-4 flex justify-between items-center"
      style={{ color: "white" }}
    >
      <div className="flex items-center justify-between w-full">
        <Link href="/" className="text-xl font-bold mr-4 flex items-center">
          <Home className="mr-2" />
          Task Manager
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/posts"
            className="mr-4 flex items-center hover:text-blue-200"
          >
            <FileText size={20} className="mr-1" /> Posts
          </Link>
          <Link href="/users" className="flex items-center hover:text-blue-200">
            <Users size={20} className="mr-1" />
            Users
          </Link>
        </div>
      </div>
      <div className="md:hidden">
        <button onClick={toggleMobileDrawer}>
          {mobileDrawerOpen ? (
            <X size={24} data-testid="close-menu-button" />
          ) : (
            <Menu size={24} data-testid="open-menu-button" />
          )}
        </button>
      </div>
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileDrawerOpen(false)}
          data-testid="overlay"
        >
          <div
            className="fixed inset-y-0 right-0 z-50 w-64 bg-blue-700 p-4 transition-transform duration-300 ease-in-out transform translate-x-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={toggleMobileDrawer}
              className="absolute top-2 right-2"
            >
              <X size={24} data-testid="close-drawer-button" />
            </button>
            <Link href="/" className="block mb-2">
              Home
            </Link>
            <Link href="/posts" className="block mb-2">
              Posts
            </Link>
            <Link href="/users" className="block mb-2">
              Users
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AppBar;
