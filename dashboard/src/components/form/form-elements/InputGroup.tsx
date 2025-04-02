import React from 'react';
import ComponentCard from '../../common/ComponentCard';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';

export default function InputGroup() {
  const countries = [
    { code: 'US', label: '+1' },
    { code: 'GB', label: '+44' },
    { code: 'CA', label: '+1' },
    { code: 'AU', label: '+61' },
  ];

  const handlePhoneNumberChange = (e) => {
    console.log('Updated phone number:', e.value);
  };

  return (
    <ComponentCard title="Input Group">
      <div className="space-y-6">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Email
          </label>
          <div className="relative">
            <InputText
              id="email"
              placeholder="info@gmail.com"
              className="pl-[62px]"
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <i className="pi-envelope size-6" />
            </span>
          </div>
        </div>

        {/* Phone Input - Start */}
        <div>
          <label htmlFor="phone-start" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Phone (Start)
          </label>
          <div className="flex">
            <Dropdown
              id="phone-start"
              value={countries[0]}
              options={countries}
              onChange={handlePhoneNumberChange}
              optionLabel="label"
              className="mr-2 w-1/4"
            />
            <InputMask
              mask="(+999) 999-9999"
              placeholder="+1 (555) 000-0000"
              className="w-3/4"
            />
          </div>
        </div>

        {/* Phone Input - End */}
        <div>
          <label htmlFor="phone-end" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Phone (End)
          </label>
          <div className="flex">
            <InputMask
              id="phone-end"
              mask="(+999) 999-9999"
              placeholder="+1 (555) 000-0000"
              className="w-3/4"
            />
            <Dropdown
              value={countries[0]}
              options={countries}
              onChange={handlePhoneNumberChange}
              optionLabel="label"
              className="ml-2 w-1/4"
            />
          </div>
        </div>
      </div>
    </ComponentCard>
  );
}
