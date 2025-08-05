import React from 'react';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormRadioGroupProps {
  label?: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  helperText?: string;
  direction?: 'horizontal' | 'vertical';
}

const FormRadioGroup: React.FC<FormRadioGroupProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  disabled = false,
  className = '',
  helperText,
  direction = 'vertical'
}) => {
  const containerClasses = direction === 'horizontal' 
    ? 'flex flex-wrap gap-6' 
    : 'space-y-3';

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </div>
      )}
      
      <div
        className={containerClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          error ? `${name}-error` : helperText ? `${name}-helper` : undefined
        }
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled || option.disabled}
              className={`
                h-4 w-4 text-blue-600 border-gray-300
                focus:ring-blue-500 focus:ring-2 focus:ring-offset-0
                transition-colors duration-200
                ${error ? 'border-red-300' : ''}
                ${disabled || option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className={`
                ml-3 text-sm font-medium cursor-pointer
                ${disabled || option.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'}
              `}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      
      {error && (
        <p id={`${name}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p id={`${name}-helper`} className="text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default FormRadioGroup;
