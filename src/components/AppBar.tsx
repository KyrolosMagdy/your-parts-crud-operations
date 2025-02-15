"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Home, FileText, Users, Menu, X } from "lucide-react";

const AppBar: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <nav
      className="bg-blue-600 p-4 sticky top-0 z-10"
      style={{ color: "white" }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold flex items-center">
          <Home className="mr-2" /> Task Manager
        </Link>
        <div className="hidden md:flex space-x-4">
          <Link href="/posts" className="hover:text-blue-200 flex items-center">
            <FileText className="mr-1" /> Posts
          </Link>
          <Link href="/users" className="hover:text-blue-200 flex items-center">
            <Users className="mr-1" /> Users
          </Link>
        </div>
        <button className="md:hidden" onClick={toggleDrawer}>
          <Menu />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-blue-700 p-4 transition-transform duration-300 ease-in-out transform ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
        style={{ color: "white" }}
      >
        <div className="flex justify-end">
          <button onClick={closeDrawer}>
            <X />
          </button>
        </div>
        <div className="mt-8 flex flex-col space-y-4">
          <Link
            href="/"
            className="hover:text-blue-200 flex items-center"
            onClick={closeDrawer}
          >
            <Home className="mr-2" /> Home
          </Link>
          <Link
            href="/posts"
            className="hover:text-blue-200 flex items-center"
            onClick={closeDrawer}
          >
            <FileText className="mr-2" /> Posts
          </Link>
          <Link
            href="/users"
            className="hover:text-blue-200 flex items-center"
            onClick={closeDrawer}
          >
            <Users className="mr-2" /> Users
          </Link>
        </div>
      </div>

      {/* Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeDrawer}
        ></div>
      )}
    </nav>
  );
};

export default AppBar;
