interface BusinessType {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

interface BusinessTypeSelectorProps {
  title: string;
  subtitle: string;
  options: BusinessType[];
  selected: string;
  onSelect: (id: string) => void;
}

export default function BusinessTypeSelector({ 
  title, 
  subtitle, 
  options, 
  selected, 
  onSelect 
}: BusinessTypeSelectorProps) {
  return (
    <div className="max-w-4xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {options.map((option) => (
          <div
            key={option.id}
            className={`group border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg ${
              selected === option.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300'
            }`}
            onClick={() => onSelect(option.id)}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{option.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.name}</h3>
              {option.description && (
                <p className="text-sm text-gray-600">{option.description}</p>
              )}
            </div>
            {selected === option.id && (
              <div className="mt-4 text-center">
                <i className="fas fa-check text-primary-500"></i>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
