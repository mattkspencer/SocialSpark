import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

export default function Landing() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleDashboard = () => {
    setLocation("/dashboard");
  };

  const handleLogout = () => {
    // Clear any cached data and redirect to logout
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/api/logout";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Sticky Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <i className="fas fa-magic text-white text-sm"></i>
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900 tracking-tight">SocialAI</span>
            </div>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 text-sm">Welcome, {user?.firstName || user?.email}</span>
                <button onClick={handleDashboard} className="btn-primary">
                  Dashboard
                </button>
                <button onClick={handleLogout} className="btn-ghost">
                  Sign Out
                </button>
              </div>
            ) : (
              <button onClick={handleLogin} className="btn-primary">
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Premium Hero Section */}
      <main className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-25 to-white"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 lg:px-8 pt-24 pb-32">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 tracking-tight">
              AI-Powered Social Media
              <br className="hidden sm:block" />
              <span className="text-primary-500">for Your Business</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Create engaging content, schedule posts across platforms, and grow your business 
              with AI-generated content tailored to your industry.
            </p>
            
            {isAuthenticated ? (
              <div className="space-y-6 animate-slide-up">
                <p className="text-lg text-gray-700">Ready to create amazing content?</p>
                <button 
                  onClick={handleDashboard}
                  className="btn-primary text-lg px-8 py-4 shadow-premium-lg hover:shadow-premium-xl"
                >
                  <i className="fas fa-arrow-right mr-2"></i>
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <div className="space-y-8 animate-slide-up">
                <button 
                  onClick={handleLogin}
                  className="btn-primary text-lg px-8 py-4 shadow-premium-lg hover:shadow-premium-xl"
                >
                  Get Started Free
                </button>
                <p className="text-gray-500 text-lg">No credit card required • Start creating in minutes</p>
              </div>
            )}
          </div>

          {/* Premium Features Grid */}
          <div className="mt-32">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                Everything you need to succeed
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Professional-grade tools designed for modern businesses
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-premium-lg hover:shadow-premium-xl hover-lift border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-magic text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">AI Content Generation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Generate engaging posts tailored to your business type with advanced AI that understands your industry
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-premium-lg hover:shadow-premium-xl hover-lift border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-success to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-video text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Faceless Video Scripts</h3>
                <p className="text-gray-600 leading-relaxed">
                  Create engaging video content without showing your face, perfect for privacy-conscious creators
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-premium-lg hover:shadow-premium-xl hover-lift border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-warning to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-calendar-alt text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Smart Scheduling</h3>
                <p className="text-gray-600 leading-relaxed">
                  Plan and automate your content calendar across multiple platforms with intelligent timing
                </p>
              </div>
            </div>
          </div>

          {/* Premium Business Types Section */}
          <div className="mt-32 bg-gray-25 rounded-3xl p-16">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                Built for every business
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Tailored AI content generation for your specific industry and audience
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { name: "Roofing & Construction", icon: "🏠", color: "from-red-500 to-red-600" },
                { name: "Real Estate", icon: "🏡", color: "from-blue-500 to-blue-600" },
                { name: "Fitness & Health", icon: "💪", color: "from-green-500 to-green-600" },
                { name: "Restaurant & Food", icon: "🍕", color: "from-orange-500 to-orange-600" },
                { name: "Automotive", icon: "🚗", color: "from-purple-500 to-purple-600" },
                { name: "General Business", icon: "💼", color: "from-gray-500 to-gray-600" },
              ].map((business) => (
                <div key={business.name} className="bg-white rounded-2xl p-6 text-center hover-lift transition-all shadow-premium-sm hover:shadow-premium-md">
                  <div className={`w-16 h-16 bg-gradient-to-br ${business.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-2xl">{business.icon}</span>
                  </div>
                  <p className="font-semibold text-gray-900">{business.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Premium CTA Section */}
          <div className="mt-32">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-12 lg:p-16 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-32 -translate-y-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full transform -translate-x-24 translate-y-24"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
                  Ready to transform your social media?
                </h2>
                <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
                  Join thousands of businesses already using AI to create engaging content and grow their audience
                </p>
                
                {!isAuthenticated && (
                  <div className="space-y-6">
                    <button 
                      onClick={handleLogin}
                      className="bg-white text-primary-600 hover:bg-gray-50 text-lg px-8 py-4 rounded-xl font-semibold shadow-premium-lg hover:shadow-premium-xl transition-all hover:scale-[1.02]"
                    >
                      Start Creating Content
                      <i className="fas fa-arrow-right ml-2"></i>
                    </button>
                    <p className="text-blue-100 text-lg">No credit card required • Start creating in minutes</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}