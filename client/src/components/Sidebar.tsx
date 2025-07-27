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
    <aside className="w-72 bg-white shadow-premium-lg border-r border-gray-100 flex flex-col">
      {/* Premium Logo Section */}
      <div className="p-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-premium-sm">
            <i className="fas fa-magic text-white text-lg"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">SocialAI</h1>
            <p className="text-xs text-gray-500 font-medium">AI-Powered Content</p>
          </div>
        </div>
      </div>

      {/* Premium Navigation Menu */}
      <nav className="flex-1 px-6 space-y-1">
        {navigation.map((item) => {
          const isActive = location === item.href || 
            (item.href !== '/' && item.href !== '/dashboard' && location.startsWith(item.href)) ||
            (item.href === '/dashboard' && location === '/dashboard');
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.href)}
              className={cn(
                "nav-item flex items-center space-x-3 px-4 py-3 rounded-xl w-full text-left transition-all hover-lift font-medium",
                isActive
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-premium-md"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <i className={`${item.icon} w-5 text-sm`}></i>
              <span className="text-sm">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Premium User Profile */}
      <div className="p-6 border-t border-gray-100">
        <div className="bg-gray-25 rounded-2xl p-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src={user?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"} 
                alt="User profile picture" 
                className="w-12 h-12 rounded-full object-cover shadow-premium-sm ring-2 ring-white" 
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.firstName || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate font-medium">
                {user?.businessName || user?.email || 'Welcome!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
