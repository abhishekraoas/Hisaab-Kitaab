import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FloatingActionButton from "../components/FloatingActionButton";
import BottomNavigation from "../components/BottomNavigation";
import KeyboardShortcutsHelper from "../components/KeyboardShortcutsHelper";
import useKeyboardNavigation from "../hooks/useKeyboardNavigation";

export default function MainLayout({ children }) {
  // Enable global keyboard navigation
  useKeyboardNavigation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      <main className="flex-1 pb-20 md:pb-0 bg-gray-50 dark:bg-gray-900">{children}</main>
      <FloatingActionButton />
      <BottomNavigation />
      <KeyboardShortcutsHelper />
      <Footer />
    </div>
  );
}
