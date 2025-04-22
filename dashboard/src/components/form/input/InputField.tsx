import React from 'react';

interface InputProps {
  type?: string;
  id?: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  autoComplete?: string;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  className = '',
  error = false,
  min,
  max,
  step,
  hint,
  autoComplete,
}) => {
  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        autoComplete={autoComplete}
        className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800 ${className} ${
          error ? 'border-red-500' : ''
        }`}
      />
      {hint && <p className="text-sm text-gray-500 mt-1">{hint}</p>}
      {error && (
        <p className="text-red-500 text-sm mt-1">This field has an error</p>
      )}
    </div>
  );
};

export default Input;
