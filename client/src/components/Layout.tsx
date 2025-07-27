import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const handleHomeClick = () => {
    setLocation("/");
  };

  const handleLogout = () => {
    // Clear any cached data and redirect to logout
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/api/logout";
  };

  return (
    <div className="min-h-screen bg-gray-25">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Premium Logo */}
            <button 
              onClick={handleHomeClick}
              className="flex items-center space-x-3 text-gray-900 hover:text-primary-600 transition-colors group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <i className="fas fa-magic text-white text-sm"></i>
              </div>
              <span className="font-semibold text-xl tracking-tight">SocialAI</span>
            </button>
            
            {/* Right side - Premium User info */}
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-600 font-medium">
                {user?.firstName || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="btn-ghost text-sm px-4 py-2"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Premium Main content area */}
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-8 lg:p-12 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
