import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <i className="fas fa-magic text-white text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SocialAI</h1>
              <p className="text-xs text-gray-500">AI-Powered Content</p>
            </div>
          </div>
          <Button onClick={handleLogin} className="bg-primary-500 hover:bg-primary-600">
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Social Media Management for{" "}
            <span className="text-primary-500">Local Businesses</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create engaging content, schedule posts across platforms, and grow your business 
            with AI-generated content tailored to your industry.
          </p>
          <Button 
            onClick={handleLogin}
            size="lg" 
            className="bg-primary-500 hover:bg-primary-600 text-lg px-8 py-4"
          >
            Get Started Free
            <i className="fas fa-arrow-right ml-2"></i>
          </Button>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border border-primary-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-magic text-primary-500 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Content Generation</h3>
              <p className="text-gray-600">
                Generate engaging posts tailored to your business type with advanced AI
              </p>
            </CardContent>
          </Card>

          <Card className="border border-success/30 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-video text-success text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Faceless Video Scripts</h3>
              <p className="text-gray-600">
                Create engaging video content without showing your face
              </p>
            </CardContent>
          </Card>

          <Card className="border border-warning/30 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-calendar-alt text-warning text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Scheduling</h3>
              <p className="text-gray-600">
                Plan and automate your content calendar across multiple platforms
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Business Types */}
        <div className="max-w-4xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Perfect for Local Businesses
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { name: "Roofing & Construction", icon: "🏠", color: "text-red-600" },
              { name: "Real Estate", icon: "🏡", color: "text-blue-600" },
              { name: "Fitness & Health", icon: "💪", color: "text-green-600" },
              { name: "Restaurant & Food", icon: "🍕", color: "text-orange-600" },
              { name: "Automotive", icon: "🚗", color: "text-purple-600" },
              { name: "General Business", icon: "💼", color: "text-gray-600" },
            ].map((business) => (
              <div key={business.name} className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="text-4xl mb-2">{business.icon}</div>
                <p className={`font-medium ${business.color}`}>{business.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-2xl mx-auto mt-20 text-center bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Social Media?
          </h2>
          <p className="text-gray-600 mb-6">
            Join local businesses already using AI to create engaging content and grow their audience.
          </p>
          <Button 
            onClick={handleLogin}
            size="lg" 
            className="bg-primary-500 hover:bg-primary-600"
          >
            Start Creating Content
          </Button>
        </div>
      </main>
    </div>
  );
}
