import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import ProgressBar from "@/components/ProgressBar";
import BusinessTypeSelector from "@/components/BusinessTypeSelector";
import ContentTypeSelector from "@/components/ContentTypeSelector";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ContentData {
  businessType: string;
  contentType: string;
  platforms: string[];
  tone: 'professional' | 'casual' | 'enthusiastic' | 'educational';
  customPrompt: string;
  targetAudience: string;
}

export default function ContentCreator() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [contentData, setContentData] = useState<ContentData>({
    businessType: '',
    contentType: '',
    platforms: [],
    tone: 'professional',
    customPrompt: '',
    targetAudience: ''
  });
  const [generatedContent, setGeneratedContent] = useState<any>(null);

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

  const generateContentMutation = useMutation({
    mutationFn: async (data: ContentData) => {
      const response = await apiRequest('POST', '/api/ai/generate-content', data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedContent(data);
      setStep(6); // Move to preview step
      toast({
        title: "Content Generated!",
        description: "Your AI-generated content is ready for review.",
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
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const savePostMutation = useMutation({
    mutationFn: async (postData: any) => {
      const response = await apiRequest('POST', '/api/posts', postData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Post Saved!",
        description: "Your content has been saved as a draft.",
      });
      navigate("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Save Failed",
        description: "Failed to save post. Please try again.",
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

  const handleGenerate = () => {
    if (!contentData.businessType || !contentData.contentType || contentData.platforms.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please complete all required fields before generating content.",
        variant: "destructive",
      });
      return;
    }

    generateContentMutation.mutate(contentData);
  };

  const handleSave = () => {
    if (!generatedContent) return;

    const postData = {
      title: generatedContent.title,
      content: generatedContent.content,
      contentType: contentData.contentType,
      targetPlatforms: contentData.platforms,
      scheduledTime: new Date().toISOString(), // Default to now, user can edit later
      businessType: contentData.businessType,
      generationPrompt: contentData.customPrompt,
      aiModelUsed: 'gpt-4o',
      status: 'draft'
    };

    savePostMutation.mutate(postData);
  };

  const businessTypes = [
    { id: 'roofing', name: 'Roofing & Construction', icon: '🏠', description: 'Roofing, construction, home improvement' },
    { id: 'realestate', name: 'Real Estate', icon: '🏡', description: 'Real estate agents, property management' },
    { id: 'fitness', name: 'Fitness & Health', icon: '💪', description: 'Gyms, personal trainers, wellness' },
    { id: 'restaurant', name: 'Restaurant & Food', icon: '🍕', description: 'Restaurants, catering, food service' },
    { id: 'automotive', name: 'Automotive', icon: '🚗', description: 'Auto repair, dealerships, car services' },
    { id: 'general', name: 'General Business', icon: '💼', description: 'Professional services, consulting' }
  ];

  const contentTypes = [
    {
      id: 'social_post',
      name: 'Social Media Post',
      description: 'Text-based posts for Facebook, Instagram, LinkedIn with hashtags and calls-to-action',
      icon: '📝',
      duration: '2 minutes',
      platforms: ['facebook', 'instagram', 'linkedin']
    },
    {
      id: 'faceless_video',
      name: 'Faceless Video Script',
      description: 'Scripts for YouTube Shorts, Instagram Reels, and TikTok with scene directions',
      icon: '🎬',
      duration: '5 minutes',
      platforms: ['youtube', 'instagram', 'tiktok']
    },
    {
      id: 'before_after',
      name: 'Before/After Showcase',
      description: 'Highlight transformations and results with compelling narratives',
      icon: '🔄',
      duration: '3 minutes',
      platforms: ['facebook', 'instagram', 'youtube']
    },
    {
      id: 'educational_tips',
      name: 'Educational Tips',
      description: 'Share expertise and build authority with educational content',
      icon: '🎓',
      duration: '4 minutes',
      platforms: ['facebook', 'instagram', 'linkedin', 'youtube']
    }
  ];

  const platformOptions = [
    { id: 'facebook', name: 'Facebook', icon: '📘', free: true },
    { id: 'instagram', name: 'Instagram', icon: '📷', free: true },
    { id: 'youtube', name: 'YouTube', icon: '📺', free: true },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', free: true },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <ProgressBar currentStep={step} totalSteps={6} />
      </div>

      <Card>
        <CardContent className="p-8">
          {step === 1 && (
            <BusinessTypeSelector
              title="What's your business?"
              subtitle="We'll customize content templates for your industry"
              options={businessTypes}
              selected={contentData.businessType}
              onSelect={(type) => {
                setContentData({...contentData, businessType: type});
                setStep(2);
              }}
            />
          )}

          {step === 2 && (
            <ContentTypeSelector
              title="What type of content?"
              subtitle="Choose the content format that works best for your business goals"
              options={contentTypes}
              selected={contentData.contentType}
              onSelect={(type) => {
                setContentData({...contentData, contentType: type});
                setStep(3);
              }}
            />
          )}

          {step === 3 && (
            <div className="max-w-4xl">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Where do you want to post?</h2>
                <p className="text-gray-600">Select the platforms where you'd like to share your content</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {platformOptions.map((platform) => (
                  <div
                    key={platform.id}
                    className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                      contentData.platforms.includes(platform.id)
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                    onClick={() => {
                      const newPlatforms = contentData.platforms.includes(platform.id)
                        ? contentData.platforms.filter(p => p !== platform.id)
                        : [...contentData.platforms, platform.id];
                      setContentData({...contentData, platforms: newPlatforms});
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{platform.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                          {platform.free && (
                            <Badge variant="secondary" className="mt-1">Free</Badge>
                          )}
                        </div>
                      </div>
                      {contentData.platforms.includes(platform.id) && (
                        <i className="fas fa-check text-primary-500"></i>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <i className="fas fa-arrow-left mr-2"></i>
                  Previous
                </Button>
                <Button 
                  onClick={() => setStep(4)}
                  disabled={contentData.platforms.length === 0}
                >
                  Continue
                  <i className="fas fa-arrow-right ml-2"></i>
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="max-w-2xl">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Customize Your Content</h2>
                <p className="text-gray-600">Add specific details to make your content more targeted</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Content Tone
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'professional', label: 'Professional', icon: '💼' },
                      { value: 'casual', label: 'Casual', icon: '😊' },
                      { value: 'enthusiastic', label: 'Enthusiastic', icon: '🎉' },
                      { value: 'educational', label: 'Educational', icon: '🎓' },
                    ].map((tone) => (
                      <button
                        key={tone.value}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          contentData.tone === tone.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setContentData({...contentData, tone: tone.value as any})}
                      >
                        <span className="mr-2">{tone.icon}</span>
                        {tone.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="customPrompt" className="block text-sm font-medium text-gray-900 mb-2">
                    Custom Instructions (Optional)
                  </label>
                  <Textarea
                    id="customPrompt"
                    placeholder="e.g., Focus on winter roof maintenance, mention our 20+ years experience..."
                    rows={3}
                    value={contentData.customPrompt}
                    onChange={(e) => setContentData({...contentData, customPrompt: e.target.value})}
                  />
                </div>

                <div>
                  <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-900 mb-2">
                    Target Audience (Optional)
                  </label>
                  <Textarea
                    id="targetAudience"
                    placeholder="e.g., Homeowners aged 35-55 in suburban areas..."
                    rows={2}
                    value={contentData.targetAudience}
                    onChange={(e) => setContentData({...contentData, targetAudience: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <Button variant="outline" onClick={() => setStep(3)}>
                  <i className="fas fa-arrow-left mr-2"></i>
                  Previous
                </Button>
                <Button onClick={() => setStep(5)}>
                  Continue
                  <i className="fas fa-arrow-right ml-2"></i>
                </Button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Review & Generate</h2>
              <p className="text-gray-600 mb-8">Review your selections and generate AI-powered content</p>

              <div className="bg-gray-50 rounded-lg p-6 text-left mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Business Type</span>
                    <p className="text-gray-900">{businessTypes.find(b => b.id === contentData.businessType)?.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Content Type</span>
                    <p className="text-gray-900">{contentTypes.find(c => c.id === contentData.contentType)?.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Platforms</span>
                    <p className="text-gray-900">{contentData.platforms.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Tone</span>
                    <p className="text-gray-900 capitalize">{contentData.tone}</p>
                  </div>
                </div>
                {contentData.customPrompt && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-500">Custom Instructions</span>
                    <p className="text-gray-900">{contentData.customPrompt}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <Button variant="outline" onClick={() => setStep(4)}>
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back to Edit
                </Button>
                <Button 
                  onClick={handleGenerate}
                  disabled={generateContentMutation.isPending}
                  className="bg-primary-500 hover:bg-primary-600"
                >
                  {generateContentMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-magic mr-2"></i>
                      Generate Content
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === 6 && generatedContent && (
            <div className="max-w-4xl">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your AI-Generated Content</h2>
                <p className="text-gray-600">Review and customize your content before saving</p>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{generatedContent.title}</span>
                      <Badge variant={
                        generatedContent.estimatedEngagement === 'high' ? 'default' :
                        generatedContent.estimatedEngagement === 'medium' ? 'secondary' : 'outline'
                      }>
                        {generatedContent.estimatedEngagement} engagement
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-900 whitespace-pre-wrap mb-4">{generatedContent.content}</p>
                    
                    {generatedContent.hashtags && generatedContent.hashtags.length > 0 && (
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-500 mb-2 block">Hashtags</span>
                        <div className="flex flex-wrap gap-2">
                          {generatedContent.hashtags.map((tag: string, index: number) => (
                            <Badge key={index} variant="outline">#{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-primary-50 rounded-lg p-4">
                      <span className="text-sm font-medium text-primary-900 block mb-1">Call to Action</span>
                      <p className="text-primary-800">{generatedContent.callToAction}</p>
                    </div>
                  </CardContent>
                </Card>

                {generatedContent.platformVersions && Object.keys(generatedContent.platformVersions).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Platform-Optimized Versions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(generatedContent.platformVersions).map(([platform, content]) => (
                          <div key={platform}>
                            <div className="flex items-center space-x-2 mb-2">
                              <i className={`${
                                platform === 'facebook' ? 'fab fa-facebook-f text-blue-600' :
                                platform === 'instagram' ? 'fab fa-instagram text-pink-600' :
                                platform === 'youtube' ? 'fab fa-youtube text-red-600' :
                                platform === 'linkedin' ? 'fab fa-linkedin-in text-blue-700' :
                                'fas fa-share-alt text-gray-600'
                              }`}></i>
                              <span className="font-medium text-gray-900 capitalize">{platform}</span>
                            </div>
                            <p className="text-gray-700 text-sm bg-gray-50 rounded p-3">{content}</p>
                            <Separator className="mt-4" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {generatedContent.visualSuggestions && generatedContent.visualSuggestions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Visual Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {generatedContent.visualSuggestions.map((suggestion: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <i className="fas fa-camera text-gray-400 mt-1"></i>
                            <span className="text-gray-700">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <Button variant="outline" onClick={() => setStep(5)}>
                  <i className="fas fa-arrow-left mr-2"></i>
                  Generate New
                </Button>
                <div className="space-x-3">
                  <Button variant="outline" onClick={() => navigate("/")}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={savePostMutation.isPending}
                    className="bg-primary-500 hover:bg-primary-600"
                  >
                    {savePostMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save mr-2"></i>
                        Save as Draft
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
