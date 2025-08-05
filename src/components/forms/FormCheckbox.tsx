import React from 'react';

interface FormCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
  helperText?: string;
  indeterminate?: boolean;
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({
  label,
  checked,
  onChange,
  error,
  disabled = false,
  className = '',
  helperText,
  indeterminate = false
}) => {
  const checkboxClasses = `
    h-4 w-4 text-blue-600 border-gray-300 rounded
    focus:ring-blue-500 focus:ring-2 focus:ring-offset-0
    transition-colors duration-200
    ${error ? 'border-red-300' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `;

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            ref={(input) => {
              if (input) input.indeterminate = indeterminate;
            }}
            className={checkboxClasses}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${label}-error` : helperText ? `${label}-helper` : undefined
            }
          />
        </div>
        <div className="ml-3">
          <label className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
            {label}
          </label>
        </div>
      </div>
      
      {error && (
        <p id={`${label}-error`} className="text-sm text-red-600 ml-7">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p id={`${label}-helper`} className="text-sm text-gray-500 ml-7">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default FormCheckbox;
