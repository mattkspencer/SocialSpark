import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Calendar() {
  const { isAuthenticated, isLoading } = useAuth();
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

  const { data: posts = [] } = useQuery({
    queryKey: ["/api/posts"],
    enabled: isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Calendar</h1>
          <p className="text-gray-500 mt-1">Plan and schedule your content</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="text-primary-600 border-primary-600 hover:bg-primary-50"
          >
            <i className="fas fa-download mr-2"></i>
            Export Calendar
          </Button>
          
          <Button
            className="bg-primary-500 hover:bg-primary-600"
            onClick={() => navigate('/create')}
          >
            <i className="fas fa-plus mr-2"></i>
            Create Content
          </Button>
        </div>
      </div>

      {/* Calendar View Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-calendar-alt text-primary-500 text-2xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Calendar View Coming Soon</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            We're building an interactive calendar view to help you visualize and manage your content schedule.
          </p>
          
          {/* Posts List */}
          {posts && (posts as any[]).length > 0 ? (
            <div className="max-w-2xl mx-auto">
              <h4 className="text-md font-medium text-gray-900 mb-4">Your Posts</h4>
              <div className="space-y-3">
                {(posts as any[]).slice(0, 5).map((post: any) => (
                  <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        post.status === 'published' ? 'bg-success' :
                        post.status === 'scheduled' ? 'bg-warning' :
                        'bg-gray-400'
                      }`}></div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">
                          {post.title || post.content?.substring(0, 50) + "..."}
                        </p>
                        <p className="text-sm text-gray-500">
                          {post.status === 'scheduled' 
                            ? `Scheduled for ${new Date(post.scheduledTime).toLocaleDateString()}`
                            : `Created ${new Date(post.createdAt).toLocaleDateString()}`
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      {post.targetPlatforms?.slice(0, 3).map((platform: string) => (
                        <i key={platform} className={`text-sm ${
                          platform === 'facebook' ? 'fab fa-facebook-f text-blue-600' :
                          platform === 'instagram' ? 'fab fa-instagram text-pink-600' :
                          platform === 'youtube' ? 'fab fa-youtube text-red-600' :
                          platform === 'linkedin' ? 'fab fa-linkedin-in text-blue-700' :
                          'fas fa-share-alt text-gray-600'
                        }`}></i>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-500 mb-4">No posts yet. Create your first piece of content!</p>
              <Button
                onClick={() => navigate('/create')}
                className="bg-primary-500 hover:bg-primary-600"
              >
                <i className="fas fa-magic mr-2"></i>
                Create AI Content
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
