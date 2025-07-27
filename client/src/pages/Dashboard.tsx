import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useEffect } from "react";
import { useLocation } from "wouter";
import MetricCard from "@/components/MetricCard";
import QuickActionCard from "@/components/QuickActionCard";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: metrics = {}, isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
    enabled: isAuthenticated,
  });

  const { data: recentPosts = [] } = useQuery({
    queryKey: ["/api/posts"],
    enabled: isAuthenticated,
  });

  const { data: scheduledPosts = [] } = useQuery({
    queryKey: ["/api/posts/scheduled"],
    enabled: isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="space-y-8">
      {/* Premium Welcome Header */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden shadow-premium-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full transform -translate-x-24 translate-y-24"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white tracking-tight">
            Welcome back, {user?.businessName || user?.firstName || 'there'}!
          </h1>
          <p className="text-blue-100 text-xl mb-8 max-w-2xl">Ready to create engaging content that grows your business?</p>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/create")}
              className="bg-white text-primary-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold shadow-premium-lg hover:shadow-premium-xl transition-all hover:scale-[1.02]"
            >
              <i className="fas fa-magic mr-2"></i>
              Create AI Content
            </button>
            <button
              onClick={() => navigate("/calendar")}
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02]"
            >
              <i className="fas fa-calendar mr-2"></i>
              View Calendar
            </button>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Posts This Month"
          value={metricsLoading ? "..." : ((metrics as any)?.postsThisMonth || 0).toString()}
          trend={(metrics as any)?.postsTrend}
          icon="📊"
          color="primary"
        />
        <MetricCard
          title="Total Reach"
          value={metricsLoading ? "..." : formatNumber((metrics as any)?.totalReach || 0)}
          trend={(metrics as any)?.reachTrend}
          icon="👥"
          color="success"
        />
        <MetricCard
          title="Engagement Rate"
          value={metricsLoading ? "..." : ((metrics as any)?.engagementRate || "0%")}
          trend={(metrics as any)?.engagementTrend}
          icon="❤️"
          color="error"
        />
        <MetricCard
          title="Scheduled Posts"
          value={metricsLoading ? "..." : ((metrics as any)?.scheduledPosts || 0).toString()}
          icon="📅"
          color="warning"
        />
      </section>

      {/* Premium Quick Actions */}
      <section className="bg-white rounded-3xl p-8 shadow-premium-lg border border-gray-100">
        <h2 className="text-2xl font-bold mb-8 text-gray-900 tracking-tight">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickActionCard
            icon="✨"
            title="Create AI Content"
            description="Generate engaging posts with AI tailored to your business"
            timeEstimate="2 minutes"
            onClick={() => navigate("/create")}
            color="primary"
          />
          <QuickActionCard
            icon="🎬"
            title="Faceless Video"
            description="Create video content scripts without showing your face"
            timeEstimate="5 minutes"
            onClick={() => navigate("/create?type=video")}
            color="success"
          />
          <QuickActionCard
            icon="📅"
            title="Schedule Posts"
            description="Plan your content calendar and automate posting"
            timeEstimate={`${(metrics as any)?.scheduledPosts || 0} posts scheduled`}
            onClick={() => navigate("/calendar")}
            color="warning"
          />
        </div>
      </section>

      {/* Premium Recent Activity */}
      <section className="bg-white rounded-3xl p-8 shadow-premium-lg border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Recent Activity</h2>
          <button
            onClick={() => navigate("/analytics")}
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
          >
            View All <i className="fas fa-arrow-right ml-1"></i>
          </button>
        </div>

        {!recentPosts || (recentPosts as any[]).length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-inbox text-3xl text-gray-400"></i>
            </div>
            <p className="text-gray-600 mb-6 text-lg">No posts yet. Create your first AI-generated content!</p>
            <button
              onClick={() => navigate("/create")}
              className="btn-primary px-6 py-3 shadow-premium-lg hover:shadow-premium-xl"
            >
              Create Content
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {(recentPosts as any[]).slice(0, 3).map((post: any) => (
              <div key={post.id} className="flex items-start space-x-4 p-6 rounded-2xl bg-gray-25 border border-gray-100 hover-lift transition-all">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  post.status === 'published' ? 'bg-green-600' : 
                  post.status === 'scheduled' ? 'bg-orange-600' : 'bg-blue-600'
                }`}>
                  <i className={`text-white ${
                    post.status === 'published' ? 'fas fa-check' :
                    post.status === 'scheduled' ? 'fas fa-clock' : 'fas fa-magic'
                  }`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {post.status === 'published' && 'Post published successfully'}
                    {post.status === 'scheduled' && 'Post scheduled'}
                    {post.status === 'draft' && 'Draft created'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    "{post.title || post.content?.substring(0, 50)}..." • {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    {post.targetPlatforms?.map((platform: string) => (
                      <span key={platform} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        <i className={`mr-1 ${
                          platform === 'facebook' ? 'fab fa-facebook-f' :
                          platform === 'instagram' ? 'fab fa-instagram' :
                          platform === 'youtube' ? 'fab fa-youtube' :
                          platform === 'linkedin' ? 'fab fa-linkedin-in' :
                          'fas fa-share-alt'
                        }`}></i>
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Content Preview */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Content</h2>
          <Button
            onClick={() => navigate("/calendar")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md text-sm px-4 py-2"
          >
            <i className="fas fa-calendar-alt mr-2"></i>
            View Full Calendar
          </Button>
        </div>

        {!scheduledPosts || (scheduledPosts as any[]).length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-calendar-times text-4xl mb-4 text-gray-400"></i>
            <p className="text-gray-600 mb-4 text-lg">No scheduled posts. Start planning your content calendar!</p>
            <Button
              onClick={() => navigate("/calendar")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
            >
              <i className="fas fa-calendar-plus mr-2"></i>
              Schedule Content
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(scheduledPosts as any[]).slice(0, 3).map((post: any) => (
              <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {new Date(post.scheduledTime).toLocaleDateString()}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {new Date(post.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    <span className="text-xs font-medium text-orange-600">Scheduled</span>
                  </div>
                  <p className="text-sm text-gray-900 font-medium">
                    {post.title || post.content?.substring(0, 40) + "..."}
                  </p>
                  <div className="flex space-x-1 mt-1">
                    {post.targetPlatforms?.slice(0, 3).map((platform: string) => (
                      <i key={platform} className={`text-xs ${
                        platform === 'facebook' ? 'fab fa-facebook-f text-blue-600' :
                        platform === 'instagram' ? 'fab fa-instagram text-pink-600' :
                        platform === 'youtube' ? 'fab fa-youtube text-red-600' :
                        platform === 'linkedin' ? 'fab fa-linkedin-in text-blue-700' :
                        'fas fa-share-alt text-gray-600'
                      }`}></i>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
