import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 dark:bg-gray-950 text-white p-4 mt-auto text-center transition-colors duration-200">
      &copy; {new Date().getFullYear()} Hisaab-Kitaab
    </footer>
  );
}
