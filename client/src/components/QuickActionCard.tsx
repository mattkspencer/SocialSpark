interface QuickActionCardProps {
  icon: string;
  title: string;
  description: string;
  timeEstimate?: string;
  onClick: () => void;
  color?: 'primary' | 'success' | 'warning';
}

export default function QuickActionCard({ 
  icon, 
  title, 
  description, 
  timeEstimate, 
  onClick, 
  color = 'primary' 
}: QuickActionCardProps) {
  const colorClasses = {
    primary: 'from-primary-50 to-primary-100 border-primary-200 bg-primary-500 text-primary-900 text-primary-700 text-primary-600 text-primary-500',
    success: 'from-green-50 to-green-100 border-green-200 bg-success text-green-900 text-green-700 text-green-600 text-success',
    warning: 'from-orange-50 to-orange-100 border-orange-200 bg-warning text-orange-900 text-orange-700 text-orange-600 text-warning',
  };

  const getGradientClasses = () => {
    switch (color) {
      case 'success':
        return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200';
      case 'warning':
        return 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200';
      default:
        return 'bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200';
    }
  };

  const getIconBgClass = () => {
    switch (color) {
      case 'success':
        return 'bg-success';
      case 'warning':
        return 'bg-warning';
      default:
        return 'bg-primary-500';
    }
  };

  const getTextColorClass = () => {
    switch (color) {
      case 'success':
        return 'text-green-900';
      case 'warning':
        return 'text-orange-900';
      default:
        return 'text-primary-900';
    }
  };

  const getSubtextColorClass = () => {
    switch (color) {
      case 'success':
        return 'text-green-700';
      case 'warning':
        return 'text-orange-700';
      default:
        return 'text-primary-700';
    }
  };

  const getArrowColorClass = () => {
    switch (color) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      default:
        return 'text-primary-500';
    }
  };

  const getTimeEstimateColorClass = () => {
    switch (color) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-orange-600';
      default:
        return 'text-primary-600';
    }
  };

  return (
    <div 
      className={`group ${getGradientClasses()} p-6 rounded-xl border hover:shadow-md transition-all cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${getIconBgClass()} rounded-lg flex items-center justify-center`}>
          <span className="text-white text-xl">{icon}</span>
        </div>
        <i className={`fas fa-arrow-right ${getArrowColorClass()} group-hover:transform group-hover:translate-x-1 transition-transform`}></i>
      </div>
      <h3 className={`text-lg font-semibold ${getTextColorClass()} mb-2`}>{title}</h3>
      <p className={`${getSubtextColorClass()} text-sm`}>{description}</p>
      {timeEstimate && (
        <div className={`mt-4 text-xs ${getTimeEstimateColorClass()} font-medium`}>
          {timeEstimate.includes('minute') ? `Average time: ${timeEstimate}` : timeEstimate}
        </div>
      )}
    </div>
  );
}
