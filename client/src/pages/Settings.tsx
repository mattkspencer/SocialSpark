import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useEffect } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Settings() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    defaultTimezone: '',
  });

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

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        businessName: (user as any)?.businessName || '',
        businessType: (user as any)?.businessType || '',
        defaultTimezone: (user as any)?.defaultTimezone || 'UTC',
      });
    }
  }, [user]);

  const { data: platformConnections = [] } = useQuery({
    queryKey: ["/api/platforms"],
    enabled: isAuthenticated,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('PUT', '/api/user/business-settings', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Settings Updated",
        description: "Your business settings have been saved successfully.",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Update Failed",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate(formData);
  };

  const businessTypes = [
    { value: 'roofing', label: 'Roofing & Construction' },
    { value: 'realestate', label: 'Real Estate' },
    { value: 'fitness', label: 'Fitness & Health' },
    { value: 'restaurant', label: 'Restaurant & Food' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'general', label: 'General Business' },
  ];

  const timezones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Chicago', label: 'Central Time' },
    { value: 'America/Denver', label: 'Mountain Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and business preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="Enter your business name"
                />
              </div>

              <div>
                <Label htmlFor="businessType">Business Type</Label>
                <Select
                  value={formData.businessType}
                  onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="defaultTimezone">Default Timezone</Label>
                <Select
                  value={formData.defaultTimezone}
                  onValueChange={(value) => setFormData({ ...formData, defaultTimezone: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={updateSettingsMutation.isPending}
                className="w-full bg-primary-500 hover:bg-primary-600"
              >
                {updateSettingsMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Save Settings
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Platform Connections */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Connections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 'facebook', name: 'Facebook', icon: 'fab fa-facebook-f', color: 'text-blue-600' },
                { id: 'instagram', name: 'Instagram', icon: 'fab fa-instagram', color: 'text-pink-600' },
                { id: 'youtube', name: 'YouTube', icon: 'fab fa-youtube', color: 'text-red-600' },
                { id: 'linkedin', name: 'LinkedIn', icon: 'fab fa-linkedin-in', color: 'text-blue-700' },
              ].map((platform) => {
                const isConnected = platformConnections?.some((conn: any) => 
                  conn.platform === platform.id && conn.isActive
                );

                return (
                  <div key={platform.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <i className={`${platform.icon} ${platform.color} text-xl`}></i>
                      <div>
                        <h3 className="font-medium text-gray-900">{platform.name}</h3>
                        <p className="text-sm text-gray-500">
                          {isConnected ? 'Connected' : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={isConnected ? "outline" : "default"}
                      size="sm"
                      disabled
                    >
                      {isConnected ? 'Connected' : 'Connect'}
                    </Button>
                  </div>
                );
              })}
              
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">
                  Platform connections will be available in a future update.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Email</Label>
              <p className="text-gray-900">{user?.email || 'Not provided'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Name</Label>
              <p className="text-gray-900">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.firstName || 'Not provided'
                }
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Subscription</Label>
              <p className="text-gray-900 capitalize">{user?.subscriptionTier || 'Free'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Member Since</Label>
              <p className="text-gray-900">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
              onClick={() => window.location.href = "/api/logout"}
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
