import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-blue-500 text-white p-4 fixed top-0 left-0 w-full z-50 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="font-bold text-xl">Hisaab-Kitaab</h1>
        <nav className="space-x-4">
          <Link to="/" className="hover:underline">Sign In</Link>
          <Link to="/signup" className="hover:underline">Sign Up</Link>
        </nav>
      </div>
    </header>
  );
}
