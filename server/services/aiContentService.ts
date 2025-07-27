import { openai } from "./openai";

interface ContentRequest {
  businessType: string;
  contentType: 'social_post' | 'faceless_video' | 'before_after' | 'educational_tips';
  platforms: string[];
  tone: 'professional' | 'casual' | 'enthusiastic' | 'educational';
  customPrompt?: string;
  targetAudience?: string;
}

interface GeneratedContent {
  title: string;
  content: string;
  hashtags: string[];
  platformVersions: Record<string, string>;
  visualSuggestions?: string[];
  callToAction: string;
  estimatedEngagement: 'low' | 'medium' | 'high';
}

interface VideoSegment {
  timeStart: number;
  timeEnd: number;
  script: string;
  visualCue: string;
  textOverlay?: string;
  transition?: string;
}

interface FacelessVideoScript {
  title: string;
  totalDuration: number;
  segments: VideoSegment[];
  hashtags: string[];
  description: string;
}

export class AIContentService {
  static async generateContent(request: ContentRequest): Promise<GeneratedContent> {
    const systemPrompt = this.buildSystemPrompt(request);
    const userPrompt = this.buildUserPrompt(request);
    
    try {
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 1000
      });

      const generatedContent = JSON.parse(response.choices[0].message.content || '{}');
      
      // Generate platform-specific versions
      const platformVersions = await this.optimizeForPlatforms(
        generatedContent.content, 
        request.platforms
      );

      return {
        ...generatedContent,
        platformVersions
      };
      
    } catch (error) {
      console.error('AI Content Generation Error:', error);
      throw new Error('Failed to generate content. Please try again.');
    }
  }

  private static buildSystemPrompt(request: ContentRequest): string {
    const businessPrompts = {
      roofing: `You are a social media expert specializing in roofing and construction businesses. Create content that:
        - Builds trust and authority in roofing expertise
        - Addresses common homeowner concerns (leaks, storm damage, maintenance)
        - Showcases quality workmanship and reliability
        - Uses industry terminology appropriately
        - Includes strong calls-to-action for free estimates or consultations`,
      
      realestate: `You are a social media expert for real estate professionals. Create content that:
        - Builds trust in real estate expertise
        - Provides valuable market insights and tips
        - Showcases properties and market knowledge
        - Addresses buyer and seller concerns
        - Includes calls-to-action for consultations`,

      construction: `You are a social media expert for construction businesses. Create content that:
        - Demonstrates construction expertise and craftsmanship
        - Showcases completed projects and transformations
        - Addresses homeowner renovation concerns
        - Builds trust through quality work examples
        - Includes calls-to-action for project consultations`,

      fitness: `You are a social media expert for fitness and health businesses. Create content that:
        - Motivates and inspires healthy lifestyle changes
        - Provides valuable fitness and nutrition tips
        - Showcases client transformations and success stories
        - Builds authority in health and wellness
        - Includes calls-to-action for training sessions or consultations`,

      restaurant: `You are a social media expert for restaurants and food businesses. Create content that:
        - Showcases delicious food and dining experiences
        - Highlights fresh ingredients and cooking techniques
        - Creates appetite appeal and food cravings
        - Builds community around food culture
        - Includes calls-to-action for reservations or orders`,

      automotive: `You are a social media expert for automotive businesses. Create content that:
        - Demonstrates automotive expertise and service quality
        - Addresses common car maintenance and repair concerns
        - Showcases vehicle transformations and services
        - Builds trust in automotive knowledge
        - Includes calls-to-action for service appointments`,
      
      general: `You are a versatile social media content creator. Create engaging, professional content that:
        - Builds brand authority and trust
        - Provides genuine value to the audience
        - Uses appropriate industry language
        - Includes compelling calls-to-action`
    };

    const contentTypePrompts = {
      social_post: 'Create engaging social media posts that spark conversation and engagement',
      faceless_video: 'Create video scripts for faceless content with clear visual cues and timing',
      before_after: 'Create content showcasing transformations and results',
      educational_tips: 'Create educational content that positions the business as an expert'
    };

    return `${businessPrompts[request.businessType as keyof typeof businessPrompts] || businessPrompts.general}

${contentTypePrompts[request.contentType]}

Tone: ${request.tone}
Format your response as valid JSON with these fields:
- title: Attention-grabbing title
- content: Main content body
- hashtags: Array of relevant hashtags (max 10)
- visualSuggestions: Array of visual content suggestions
- callToAction: Clear, compelling call-to-action
- estimatedEngagement: Predicted engagement level (low/medium/high)`;
  }

  private static buildUserPrompt(request: ContentRequest): string {
    const basePrompt = `Create ${request.contentType} content for a ${request.businessType} business.`;
    
    if (request.customPrompt) {
      return `${basePrompt}\n\nSpecific requirements: ${request.customPrompt}`;
    }

    // Industry-specific default prompts
    const defaultPrompts = {
      roofing: {
        social_post: 'Create a post about the importance of regular roof inspections for homeowners',
        faceless_video: 'Create a script about "5 signs your roof needs repair" with visual cues',
        before_after: 'Create content showcasing a roof transformation project',
        educational_tips: 'Create educational content about roof maintenance for homeowners'
      },
      construction: {
        social_post: 'Create a post about home renovation tips and considerations',
        faceless_video: 'Create a script about "Planning your dream home renovation" with visual cues',
        before_after: 'Create content showcasing a home renovation transformation',
        educational_tips: 'Create educational content about construction materials and quality'
      },
      realestate: {
        social_post: 'Create a post about current market trends and home buying tips',
        faceless_video: 'Create a script about "First-time home buyer mistakes to avoid"',
        before_after: 'Create content showcasing a home staging transformation',
        educational_tips: 'Create educational content about the home buying process'
      },
      fitness: {
        social_post: 'Create a motivational post about fitness goals and healthy habits',
        faceless_video: 'Create a script about "5 simple exercises for busy professionals"',
        before_after: 'Create content showcasing fitness transformation results',
        educational_tips: 'Create educational content about nutrition and exercise fundamentals'
      },
      restaurant: {
        social_post: 'Create a post about seasonal ingredients and signature dishes',
        faceless_video: 'Create a script about "Behind the scenes: Fresh ingredients preparation"',
        before_after: 'Create content showcasing recipe development or restaurant makeover',
        educational_tips: 'Create educational content about cooking techniques or food quality'
      },
      automotive: {
        social_post: 'Create a post about seasonal car maintenance and safety tips',
        faceless_video: 'Create a script about "Essential car maintenance checklist"',
        before_after: 'Create content showcasing vehicle restoration or repair',
        educational_tips: 'Create educational content about car care and maintenance'
      }
    };

    const industryPrompts = defaultPrompts[request.businessType as keyof typeof defaultPrompts];
    if (industryPrompts && industryPrompts[request.contentType as keyof typeof industryPrompts]) {
      return `${basePrompt}\n\n${industryPrompts[request.contentType as keyof typeof industryPrompts]}`;
    }

    return basePrompt;
  }

  private static async optimizeForPlatforms(
    content: string, 
    platforms: string[]
  ): Promise<Record<string, string>> {
    const optimizations = {};

    for (const platform of platforms) {
      const platformSpecs = {
        facebook: {
          maxLength: 2000,
          style: 'Conversational, can be longer, include links and detailed descriptions',
          format: 'Paragraph format with line breaks, emojis welcome'
        },
        instagram: {
          maxLength: 2200,
          style: 'Visual-focused, use emojis, hashtag-heavy, story-telling',
          format: 'Short paragraphs, lots of line breaks, emoji integration'
        },
        youtube: {
          maxLength: 1000,
          style: 'Video description format, include timestamps and chapter markers',
          format: 'Description for video content with call-to-action'
        },
        linkedin: {
          maxLength: 3000,
          style: 'Professional, industry insights, thought leadership',
          format: 'Professional tone, business-focused content'
        },
        twitter: {
          maxLength: 280,
          style: 'Concise, punchy, thread-friendly',
          format: 'Short and impactful, use threads for longer content'
        }
      };

      const spec = platformSpecs[platform as keyof typeof platformSpecs];
      if (spec) {
        (optimizations as any)[platform] = await this.optimizeForSpecificPlatform(content, spec);
      } else {
        (optimizations as any)[platform] = content; // Fallback to original content
      }
    }

    return optimizations;
  }

  private static async optimizeForSpecificPlatform(content: string, spec: any): Promise<string> {
    try {
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Optimize this content for a specific social media platform.
Platform requirements:
- Max length: ${spec.maxLength} characters
- Style: ${spec.style}  
- Format: ${spec.format}

Keep the core message and call-to-action intact while adapting the format and style.`
          },
          {
            role: 'user',
            content: `Optimize this content: ${content}`
          }
        ],
        temperature: 0.5,
        max_tokens: 500
      });

      return response.choices[0].message.content || content;
    } catch (error) {
      console.error('Platform optimization error:', error);
      return content; // Fallback to original content
    }
  }

  static async generateFacelessVideoScript(
    businessType: string,
    topic: string,
    duration: number = 60
  ): Promise<FacelessVideoScript> {
    const systemPrompt = `You are an expert at creating engaging faceless video scripts for ${businessType} businesses.

Create a ${duration}-second video script with:
- Hook (0-3s): Attention-grabbing opening
- Problem/Situation (3-20s): Identify the issue or situation
- Solution/Value (20-50s): Provide expertise and value
- Call-to-Action (50-60s): Clear next step

Include detailed visual cues for faceless content:
- Text overlays
- Image/video suggestions
- Transitions
- Timing markers

Format as JSON with timeline segments:
{
  "title": "Video title",
  "totalDuration": ${duration},
  "segments": [
    {
      "timeStart": 0,
      "timeEnd": 3,
      "script": "Spoken words",
      "visualCue": "What to show on screen",
      "textOverlay": "Text to display",
      "transition": "Transition effect"
    }
  ],
  "hashtags": ["relevant", "hashtags"],
  "description": "Video description for platforms"
}`;

    try {
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create a faceless video script about: ${topic}` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
        max_tokens: 800
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Video script generation error:', error);
      throw new Error('Failed to generate video script. Please try again.');
    }
  }
}
