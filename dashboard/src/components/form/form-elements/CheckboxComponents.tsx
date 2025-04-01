import { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Checkbox from "../input/Checkbox";
import React from "react";

export default function CheckboxComponents() {
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckedTwo, setIsCheckedTwo] = useState(true);
  const [isCheckedDisabled, setIsCheckedDisabled] = useState(false);
  return (
    <ComponentCard title="Checkbox">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Checkbox
            id="default-checkbox"
            label="Default Checkbox"
            checked={isChecked}
            onChange={setIsChecked}
          />
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Default
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox
            id="default-checkbox"
            label="Default Checkbox"
            checked={isChecked}
            onChange={setIsChecked}
          />
        </div>
        <div className="flex items-center gap-3">
          <Checkbox
            id="default-checkbox"
            label="Default Checkbox"
            checked={isChecked}
            onChange={setIsChecked}
          />
        </div>
      </div>
    </ComponentCard>
  );
}