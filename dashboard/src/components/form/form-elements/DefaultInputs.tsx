import { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import DatePicker from "../date-picker.tsx";
import React from "react";

export default function DefaultInputs() {
  const [showPassword, setShowPassword] = useState(false);
  const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ];
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };

  return (
    <ComponentCard title="Default Inputs">
      <div className="space-y-6">
        <div>
          <Label htmlFor="input" className="">Input</Label>
          <Input
            type="text"
            id="input"
            name="inputName"
            placeholder="Enter text"
            value=""
            onChange={(e) => console.log(e.target.value)}
            className=""
            min={0}
            max={100}
            step={1}
            hint="Enter your input"
          />
        </div>
        <div>
          <Label htmlFor="inputTwo" className="">Input with Placeholder</Label>
          <Input
            type="text"
            id="inputTwo"
            name="email"
            placeholder="info@gmail.com"
            value=""
            onChange={(e) => console.log(e.target.value)}
            min={0}
            max={100}
            step={1}
            hint="Enter your email"
          />
        </div>
        <div>
          <Label htmlFor="select-input" className="">Select Input</Label>
          <Select
            options={options}
            placeholder="Select an option"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
        </div>
        <div>
          <Label htmlFor="password-input" className="">Password Input</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              id="password-input"
              name="password"
              placeholder="Enter your password"
              value=""
              onChange={(e) => console.log(e.target.value)}
              className=""
              min={0}
              max={100}
              step={1}
              hint="Enter your password"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/3"
            >
              {showPassword ? (
                <i className="pi pi-eye text-gray-500 dark:text-gray-400 text-xl"></i>  // Sử dụng icon của PrimeReact
              ) : (
                <i className="pi pi-eye-slash text-gray-500 dark:text-gray-400 text-xl"></i>  // Sử dụng icon của PrimeReact
              )}
            </button>
          </div>
        </div>

        <div>
          <DatePicker
            id="date-picker"
            mode="single" // Example mode, adjust as needed
            defaultDate={new Date()} // Example default date, adjust as needed
            label="Date Picker Input"
            placeholder="Select a date"
            onChange={(dates, currentDateString) => {
              console.log({ dates, currentDateString });
            }}
          />
        </div>

        <div>
          <Label htmlFor="tm" className="">Time Picker Input</Label>
          <div className="relative">
            <Input
              type="time"
              id="tm"
              name="tm"
              placeholder="Select time"
              value=""
              onChange={(e) => console.log(e.target.value)}
              min="00:00"
              max="23:59"
              step={60}
              hint="Select a time"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/3 dark:text-gray-400">
              <i className="pi pi-clock text-gray-500 dark:text-gray-400 text-xl"></i>
            </span>
          </div>
        </div>
        <div>
          <Label htmlFor="tm" className="your-class-name">Input with Payment</Label>
          <div className="relative">
            <Input
              type="text"
              id="card-number"
              name="cardNumber"
              placeholder="Card number"
              value=""
              onChange={(e) => console.log(e.target.value)}
              className="pl-[62px]"
              min={0}
              max={100}
              step={1}
              hint="Enter your card number"
            />
            <span className="absolute left-0 top-1/3 flex h-11 w-[46px] -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800">
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
