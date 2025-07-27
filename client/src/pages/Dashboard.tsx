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
      {/* Welcome Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2 text-white">
            Welcome back, {user?.businessName || user?.firstName || 'there'}!
          </h1>
          <p className="text-blue-100 text-lg">Ready to create engaging content today?</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button
              onClick={() => navigate("/create")}
              className="bg-white text-blue-700 hover:bg-gray-50 font-semibold shadow-md"
            >
              <i className="fas fa-magic mr-2"></i>
              Create AI Content
            </Button>
            <Button
              onClick={() => navigate("/calendar")}
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-700 font-semibold"
            >
              <i className="fas fa-calendar mr-2"></i>
              View Calendar
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-32 -translate-y-32"></div>
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

      {/* Quick Actions */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Recent Activity */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <Button
            variant="ghost"
            className="text-primary-600 hover:text-primary-700"
            onClick={() => navigate("/analytics")}
          >
            View All
          </Button>
        </div>

        {!recentPosts || (recentPosts as any[]).length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-inbox text-4xl mb-4 text-gray-400"></i>
            <p className="text-gray-600 mb-4 text-lg">No posts yet. Create your first AI-generated content!</p>
            <Button
              onClick={() => navigate("/create")}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
            >
              Create Content
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {(recentPosts as any[]).slice(0, 3).map((post: any) => (
              <div key={post.id} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
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
            variant="ghost"
            className="text-primary-600 hover:text-primary-700"
            onClick={() => navigate("/calendar")}
          >
            <i className="fas fa-calendar-alt mr-1"></i>
            View Full Calendar
          </Button>
        </div>

        {!scheduledPosts || (scheduledPosts as any[]).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-calendar-times text-4xl mb-4 text-gray-300"></i>
            <p>No scheduled posts. Start planning your content calendar!</p>
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
                <div className="bg-warning/10 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span className="text-xs font-medium text-warning">Scheduled</span>
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
