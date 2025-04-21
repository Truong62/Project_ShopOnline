import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Button from '../ui/button/Button';

export default function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [code, setCode] = useState(['', '', '', '']);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success' | ''>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const sendVerificationCode = async () => {
    if (!email) {
      setMessage('Please enter your email!');
      setMessageType('error');
      return;
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setMessage('Please enter a valid email address.');
      setMessageType('error');
      return;
    }

    try {
      const response = await fetch(
        'https://18.139.41.39:444/api/accounts/password-forgot',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        let errorMessage = `Failed to send verification code: ${response.status} ${response.statusText}`;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          errorMessage = data.message || data.error || errorMessage;
        } else {
          const text = await response.text();
          console.error('API error response:', text);
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.warn('Non-JSON response received:', text);
        data = { success: true, message: text || 'Verification code sent.' };
      }

      if (data.success) {
        setIsCodeSent(true);
        setMessage(`Verification code sent to email: ${email}`);
        setMessageType('success');
      } else {
        setMessage(data.message || 'Failed to send verification code.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setMessage(
        error.message ||
          'An error occurred while sending the verification code. Please try again.'
      );
      setMessageType('error');
    }
  };

  const handleCodeChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const verifyCode = async () => {
    const enteredCode = code.join('');
    if (enteredCode.length !== 4) {
      setMessage('Please enter a 4-digit code.');
      setMessageType('error');
      return;
    }

    try {
      // TODO: Replace with the correct OTP verification endpoint
      const response = await fetch(
        'https://18.139.41.39:444/api/accounts/verify-otp', // Update this URL
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, code: enteredCode }),
        }
      );

      if (!response.ok) {
        let errorMessage = `Verification failed: ${response.status} ${response.statusText}`;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          errorMessage = data.message || data.error || errorMessage;
        } else {
          const text = await response.text();
          console.error('API error response:', text);
          errorMessage = text || errorMessage;
        }
        if (response.status === 404) {
          errorMessage =
            'Verification endpoint not found. Please contact support.';
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.warn('Non-JSON response received:', text);
        data = { success: true, message: text || 'Verification successful.' };
      }

      if (data.success) {
        setIsCodeVerified(true);
        setMessage('Verification successful. Please enter your new password.');
        setMessageType('success');
      } else {
        setMessage(data.message || 'Incorrect verification code.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setMessage(
        error.message ||
          'An error occurred during verification. Please try again.'
      );
      setMessageType('error');
    }
  };

  const resetPassword = async () => {
    if (!newPassword || !rePassword) {
      setMessage('Please fill in both password fields.');
      setMessageType('error');
      return;
    }
    if (newPassword !== rePassword) {
      setMessage('Passwords do not match.');
      setMessageType('error');
      return;
    }

    try {
      const enteredCode = code.join('');
      const response = await fetch(
        'https://18.139.41.39:444/api/accounts/password-change',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, code: enteredCode, newPassword }),
        }
      );

      if (!response.ok) {
        let errorMessage = `Failed to change password: ${response.status} ${response.statusText}`;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          errorMessage = data.message || data.error || errorMessage;
        } else {
          const text = await response.text();
          console.error('API error response:', text);
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.warn('Non-JSON response received:', text);
        data = {
          success: true,
          message: text || 'Password changed successfully.',
        };
      }

      if (data.success) {
        setMessage('Password changed successfully! You can now log in.');
        setMessageType('success');
      } else {
        setMessage(data.message || 'Failed to change password.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage(
        error.message ||
          'An error occurred while changing the password. Please try again.'
      );
      setMessageType('error');
    }
  };

  return (
    <div className="flex flex-col min-h-screen px-4 py-8 sm:px-6 lg:px-8 bg-white">
      <div className="w-full max-w-md mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 mb-4"
        >
          <i className="pi pi-chevron-left size-5 mr-1" />
          Back to Home
        </Link>

        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Forgot Password
          </h2>

          {!isCodeSent && (
            <div className="mb-6">
              <Label htmlFor="email" className="">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                hint="Please enter a valid email address."
                min={0}
                max={100}
                step={1}
              />
              <Button
                onClick={sendVerificationCode}
                className="w-full mt-4"
                startIcon={null}
                endIcon={null}
              >
                Send Verification Code
              </Button>
            </div>
          )}

          {isCodeSent && !isCodeVerified && (
            <>
              <p className="text-sm text-center text-green-600 mb-4">
                Verification code sent to: <strong>{email}</strong>
              </p>

              <div className="mb-6">
                <Label htmlFor="verificationCode" className="">
                  Enter the 4-digit code
                </Label>
                <div className="flex justify-center gap-3 mt-3">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl border border-gray-300 rounded-lg focus:outline-blue-500"
                      value={digit}
                      onChange={(e) => handleCodeChange(e.target.value, index)}
                      ref={(el) => {
                        inputsRef.current[index] = el;
                      }}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Please enter the exact 4 digits.
                </p>
              </div>

              <Button
                onClick={verifyCode}
                className="w-full mb-2"
                startIcon={null}
                endIcon={null}
              >
                Verify Code
              </Button>
              <Button
                variant="outline"
                onClick={sendVerificationCode}
                className="w-full text-sm"
                startIcon={null}
                endIcon={null}
              >
                Resend Code
              </Button>
            </>
          )}

          {isCodeVerified && (
            <>
              <div className="mb-4">
                <Label htmlFor="newPassword" className="">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e: any) => setNewPassword(e.target.value)}
                    placeholder="********"
                    hint="Please enter your new password."
                    min={0}
                    max={100}
                    step={1}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  >
                    <i
                      className={`pi ${showPassword ? 'pi-eye' : 'pi-eye-slash'}`}
                    />
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <Label htmlFor="rePassword" className="">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="rePassword"
                    name="rePassword"
                    type={showRePassword ? 'text' : 'password'}
                    value={rePassword}
                    onChange={(e: any) => setRePassword(e.target.value)}
                    placeholder="********"
                    hint="Please confirm your new password."
                    min={0}
                    max={100}
                    step={1}
                  />
                  <span
                    onClick={() => setShowRePassword(!showRePassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  >
                    <i
                      className={`pi ${showRePassword ? 'pi-eye' : 'pi-eye-slash'}`}
                    />
                  </span>
                </div>
              </div>

              <Button
                onClick={resetPassword}
                className="w-full"
                startIcon={null}
                endIcon={null}
              >
                Confirm Password Change
              </Button>
            </>
          )}

          {message && (
            <p
              className={`mt-4 text-center text-sm ${
                messageType === 'error' ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {message}
            </p>
          )}

          <div className="mt-6 text-center text-sm">
            <Link to="/login" className="text-blue-500 hover:underline">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
