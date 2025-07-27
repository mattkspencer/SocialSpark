import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

const navigation = [
  { id: 'dashboard', name: 'Dashboard', href: '/dashboard', icon: 'fas fa-chart-line' },
  { id: 'create', name: 'Create Content', href: '/create', icon: 'fas fa-plus-circle' },
  { id: 'calendar', name: 'Calendar', href: '/calendar', icon: 'fas fa-calendar-alt' },
  { id: 'analytics', name: 'Analytics', href: '/analytics', icon: 'fas fa-chart-bar' },
  { id: 'settings', name: 'Settings', href: '/settings', icon: 'fas fa-cog' },
];

export default function Sidebar() {
  const { user } = useAuth();
  const [location, navigate] = useLocation();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-magic text-white text-lg"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">SocialAI</h1>
            <p className="text-xs text-gray-500">AI-Powered Content</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href || 
            (item.href !== '/' && item.href !== '/dashboard' && location.startsWith(item.href)) ||
            (item.href === '/dashboard' && location === '/dashboard');
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.href)}
              className={cn(
                "nav-item flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-left transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <i className={`${item.icon} w-5`}></i>
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <img 
            src={user?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"} 
            alt="User profile picture" 
            className="w-10 h-10 rounded-full object-cover" 
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.businessName || user?.email || 'Welcome!'}
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-gray-400 hover:text-gray-500"
            title="Sign out"
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </aside>
  );
}
