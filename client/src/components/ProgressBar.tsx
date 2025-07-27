interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepName?: string;
}

export default function ProgressBar({ currentStep, totalSteps, stepName }: ProgressBarProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Step {currentStep} of {totalSteps}
        </span>
        {stepName && (
          <span className="text-sm text-gray-500">{stepName}</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary-500 h-2 rounded-full transition-all duration-300" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}
