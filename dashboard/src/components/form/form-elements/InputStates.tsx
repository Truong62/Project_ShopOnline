import { useState } from 'react';
import ComponentCard from '../../common/ComponentCard';
import Input from '../input/InputField';
import Label from '../Label';
import React from 'react';
export default function InputStates() {
  const [email, setEmail] = useState('');
  const [emailTwo, setEmailTwo] = useState('');
  const [error, setError] = useState(false);

  // Simulate a validation check
  const validateEmail = (value: string) => {
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
          <Label htmlFor="inputEmail" className="">
            Email
          </Label>
          <Input
            type="string"
            name="email"
            value={''}
            error={true}
            onChange={(e) =>{console.log(e)}}
            placeholder="Enter your email"
            min={0}
            max={100}
            step={1}
            hint={error ? 'This is an invalid email address.' : ''}
          ></Input>
        </div>

        {/* Success Input */}
        <div>
          <Label htmlFor="inputEmailEmail" className="">
            Email
          </Label>
          <Input
            type="email"
            value={emailTwo}
            success={!error}
            onChange={handleEmailTwoChange}
            placeholder="Enter your email"
            hint={!error ? 'This is an success message.' : ''}
          />
        </div>

        {/* Disabled Input */}
        <div>
          <Label htmlFor="inputId" className="">
            Email
          </Label>
          <Input
            type="text"
            value="disabled@example.com"
            disabled={true}
            placeholder="Disabled email"
          />
        </div>
      </div>
    </ComponentCard>
  );
}
