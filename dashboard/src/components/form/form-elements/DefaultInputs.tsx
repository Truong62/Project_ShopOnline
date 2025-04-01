import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import ComponentCard from '../../common/ComponentCard';
import React from 'react';
import { PiEyeClosed, PiEye, PiClock } from 'react-icons/pi';  // Importing PrimeIcons from react-icons/pi

export default function DefaultInputs() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [date, setDate] = useState<Date | null>(null);

  const options = [
    { value: 'marketing', label: 'Marketing' },
    { value: 'template', label: 'Template' },
    { value: 'development', label: 'Development' },
  ];

  const handleSelectChange = (e) => {
    console.log('Selected value:', e.value);
    setSelectedOption(e.value);
  };

  return (
    <ComponentCard title="Default Inputs">
      <div className="space-y-6">
        <div>
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 dark:text-gray-400">Input</label>
          <InputText id="input" />
        </div>
        <div>
          <label htmlFor="inputTwo" className="block text-sm font-medium text-gray-700 dark:text-gray-400">Input with Placeholder</label>
          <InputText id="inputTwo" placeholder="info@gmail.com" />
        </div>
        <div>
          <label htmlFor="dropdown" className="block text-sm font-medium text-gray-700 dark:text-gray-400">Select Input</label>
          <Dropdown
            value={selectedOption}
            options={options}
            onChange={handleSelectChange}
            placeholder="Select an option"
            className="dark:bg-dark-900"
            id="dropdown"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-400">Password Input</label>
          <div className="relative">
            <Password
              id="password"
              value={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              toggleMask
              onToggle={() => setShowPassword((prev) => !prev)}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
            >
              {showPassword ? (
                <PiEye className="fill-gray-500 dark:fill-gray-400 size-5" />
              ) : (
                <PiEyeClosed className="fill-gray-500 dark:fill-gray-400 size-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="date-picker" className="block text-sm font-medium text-gray-700 dark:text-gray-400">Date Picker Input</label>
          <Calendar
            id="date-picker"
            value={date}
            onChange={(e) => setDate(e.value ?? null)}
            placeholder="Select a date"
          />
        </div>

        <div>
          <label htmlFor="tm" className="block text-sm font-medium text-gray-700 dark:text-gray-400">Time Picker Input</label>
          <div className="relative">
            <InputText
              type="time"
              id="tm"
              name="tm"
              onChange={(e) => console.log(e.target.value)}
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <PiClock className="size-6" />
            </span>
          </div>
        </div>
        <div>
          <label htmlFor="payment" className="block text-sm font-medium text-gray-700 dark:text-gray-400">Input with Payment</label>
          <div className="relative">
            <InputText
              id="payment"
              type="text"
              placeholder="Card number"
              className="pl-[62px]"
            />
            <span className="absolute left-0 top-1/2 flex h-11 w-[46px] -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="6.25" cy="10" r="5.625" fill="#E80B26" />
                <circle cx="13.75" cy="10" r="5.625" fill="#F59D31" />
                <path
                  d="M10 14.1924C11.1508 13.1625 11.875 11.6657 11.875 9.99979C11.875 8.33383 11.1508 6.8371 10 5.80713C8.84918 6.8371 8.125 8.33383 8.125 9.99979C8.125 11.6657 8.84918 13.1625 10 14.1924Z"
                  fill="#FC6020"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </ComponentCard>
  );
}
