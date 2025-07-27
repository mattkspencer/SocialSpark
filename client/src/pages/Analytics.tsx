import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Analytics() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

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

  const { data: analytics = {} } = useQuery({
    queryKey: ["/api/analytics/dashboard"],
    enabled: isAuthenticated,
  });

  const { data: usageStats = {} } = useQuery({
    queryKey: ["/api/usage/stats"],
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Insights</h1>
        <p className="text-gray-500 mt-1">Track your content performance and engagement</p>
      </div>

      {/* Usage Statistics */}
      {usageStats && typeof usageStats === 'object' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">AI Requests This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{(usageStats as any)?.aiRequests || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Content generations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">Posts Created</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{(usageStats as any)?.postsCreated || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Total content pieces</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">Estimated Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${(((usageStats as any)?.totalCostCents || 0) / 100).toFixed(2)}
              </div>
              <p className="text-xs text-gray-500 mt-1">AI usage costs</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-chart-line text-primary-500 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Detailed Analytics Coming Soon</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We're building comprehensive analytics to track your social media performance, 
              engagement rates, and ROI across all platforms.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Analytics Data */}
      {analytics && (analytics as any[])?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Performance Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(analytics as any[]).slice(0, 5).map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Platform: {item.platform}</p>
                    <p className="text-sm text-gray-500">
                      Views: {item.views || 0} • Likes: {item.likes || 0} • Shares: {item.shares || 0}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(item.recordedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
