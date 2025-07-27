import { Badge } from "@/components/ui/badge";

interface ContentType {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration: string;
  platforms?: string[];
}

interface ContentTypeSelectorProps {
  title: string;
  subtitle?: string;
  options: ContentType[];
  selected: string;
  onSelect: (id: string) => void;
}

export default function ContentTypeSelector({ 
  title, 
  subtitle, 
  options, 
  selected, 
  onSelect 
}: ContentTypeSelectorProps) {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return 'fab fa-facebook-f text-blue-600';
      case 'instagram':
        return 'fab fa-instagram text-pink-600';
      case 'youtube':
        return 'fab fa-youtube text-red-600';
      case 'linkedin':
        return 'fab fa-linkedin-in text-blue-700';
      case 'tiktok':
        return 'fab fa-tiktok text-black';
      default:
        return 'fas fa-share-alt text-gray-600';
    }
  };

  const getIconBgColor = (contentType: string) => {
    switch (contentType) {
      case 'social_post':
        return 'bg-primary-100 text-primary-600';
      case 'faceless_video':
        return 'bg-green-100 text-success';
      case 'before_after':
        return 'bg-red-100 text-roofing';
      case 'educational_tips':
        return 'bg-orange-100 text-warning';
      default:
        return 'bg-primary-100 text-primary-600';
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {options.map((option) => (
          <div
            key={option.id}
            className={`group border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg ${
              selected === option.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-500'
            }`}
            onClick={() => onSelect(option.id)}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconBgColor(option.id)}`}>
                <i className={`${option.icon} text-xl`}></i>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{option.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-primary-100 text-primary-800">
                    <i className="fas fa-clock mr-1"></i>
                    {option.duration}
                  </Badge>
                  {option.platforms && (
                    <div className="flex space-x-2">
                      {option.platforms.slice(0, 3).map((platform) => (
                        <span key={platform} className="w-6 h-6 rounded flex items-center justify-center bg-gray-100">
                          <i className={`${getPlatformIcon(platform)} text-xs`}></i>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {selected === option.id && (
              <div className="mt-4 text-right">
                <i className="fas fa-check text-primary-500"></i>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
