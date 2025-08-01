interface MetricCardProps {
  title: string;
  value: string;
  trend?: string;
  icon: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
}

export default function MetricCard({ title, value, trend, icon, color = 'primary' }: MetricCardProps) {
  const colorClasses = {
    primary: 'bg-blue-50 text-blue-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-orange-50 text-orange-600',
    error: 'bg-red-50 text-red-600',
  };

  const getTrendColor = (trend?: string) => {
    if (!trend) return '';
    if (trend.startsWith('+')) return 'text-green-600';
    if (trend.startsWith('-')) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <i className={`fas fa-arrow-${trend.startsWith('+') ? 'up' : 'down'} text-sm mr-1 ${getTrendColor(trend)}`}></i>
              <span className={`text-sm font-medium ${getTrendColor(trend)}`}>{trend}</span>
              <span className="text-xs text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}
