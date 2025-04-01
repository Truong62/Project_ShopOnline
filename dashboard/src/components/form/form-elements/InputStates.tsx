import { useState } from 'react';
import ComponentCard from '../../common/ComponentCard';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import React from 'react';

export default function InputStates() {
  const [email, setEmail] = useState('');
  const [emailTwo, setEmailTwo] = useState('');
  const [error, setError] = useState(false);

  // Simulate a validation check
  const validateEmail = (value) => {
    const isValidEmail =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    setError(!isValidEmail);
    return isValidEmail;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };
  const handleEmailTwoChange = (e) => {
    const value = e.target.value;
    setEmailTwo(value);
    validateEmail(value);
  };

  return (
    <ComponentCard
      title="Input States"
      desc="Validation styles for error, success and disabled states on form controls."
    >
      <div className="space-y-5 sm:space-y-6">
        {/* Error Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Email
          </label>
          <InputText
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            className={`w-full ${error ? 'p-invalid' : ''}`}
          />
          {error && (
            <Message severity="error" text="This is an invalid email address." />
          )}
        </div>

        {/* Success Input */}
        <div>
          <label htmlFor="emailTwo" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Email
          </label>
          <InputText
            id="emailTwo"
            type="email"
            value={emailTwo}
            onChange={handleEmailTwoChange}
            placeholder="Enter your email"
            className={`w-full ${!error ? 'p-success' : ''}`}
          />
          {!error && (
            <Message severity="success" text="This is a success message." />
          )}
        </div>

        {/* Disabled Input */}
        <div>
          <label htmlFor="disabledEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Email
          </label>
          <InputText
            id="disabledEmail"
            type="text"
            value="disabled@example.com"
            disabled
            placeholder="Disabled email"
            className="w-full"
          />
        </div>
      </div>
    </ComponentCard>
  );
}
