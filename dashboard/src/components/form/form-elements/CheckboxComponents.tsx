import React, { useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import ComponentCard from '../../common/ComponentCard';

export default function CheckboxComponents() {
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckedTwo, setIsCheckedTwo] = useState(true);
  const [isCheckedDisabled, setIsCheckedDisabled] = useState(false);

  return (
    <ComponentCard title="Checkbox">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={isChecked}
            onChange={(e) => setIsChecked(e.checked ?? false)}
          />
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Default
          </span>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-3">
            <Checkbox
              checked={isCheckedTwo}
              onChange={(e) => setIsCheckedTwo(e.checked ?? false)}
            />
            <span>Checked</span>
          </label>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-3">
            <Checkbox
              checked={isCheckedDisabled}
              onChange={(e) => setIsCheckedDisabled(e.checked ?? false)}
              disabled
            />
            <span>Disabled</span>
          </label>
        </div>
      </div>
    </ComponentCard>
  );
}
