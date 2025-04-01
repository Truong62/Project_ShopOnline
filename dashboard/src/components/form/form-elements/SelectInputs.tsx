import { useState } from 'react';
import ComponentCard from '../../common/ComponentCard';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import React from 'react';

export default function SelectInputs() {
  const options = [
    { value: 'marketing', label: 'Marketing' },
    { value: 'template', label: 'Template' },
    { value: 'development', label: 'Development' },
  ];

  const handleSelectChange = (e) => {
    console.log('Selected value:', e.value);
  };

  const [selectedValues, setSelectedValues] = useState([]);

  const multiOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
    { value: '4', label: 'Option 4' },
    { value: '5', label: 'Option 5' },
  ];

  return (
    <ComponentCard title="Select Inputs">
      <div className="space-y-6">
        <div>
          <label htmlFor="singleSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Select Input
          </label>
          <Dropdown
            id="singleSelect"
            value={null}
            options={options}
            onChange={handleSelectChange}
            placeholder="Select Option"
            optionLabel="label"
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="multiSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Multiple Select Options
          </label>
          <MultiSelect
            id="multiSelect"
            value={selectedValues}
            options={multiOptions}
            onChange={(e) => setSelectedValues(e.value)}
            optionLabel="label"
            placeholder="Select Options"
            className="w-full"
          />
          <p className="sr-only">Selected Values: {selectedValues.join(', ')}</p>
        </div>
      </div>
    </ComponentCard>
  );
}
