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
    window.location.href = "/api/logout";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with homepage navigation */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo and Home button */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleHomeClick}
                className="flex items-center space-x-2 text-gray-900 hover:text-primary-600 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <i className="fas fa-magic text-white text-sm"></i>
                </div>
                <span className="font-semibold text-lg">SocialAI</span>
              </button>
            </div>
            
            {/* Right side - User info */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.firstName || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors px-3 py-1 rounded-md hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content area */}
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
