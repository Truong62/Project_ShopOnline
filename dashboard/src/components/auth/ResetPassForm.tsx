import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Button from '../ui/button/Button';

export default function ResetPasswordForm() {
  const navigate = useNavigate();
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
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

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

    setIsLoading(true);
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

        // Handle verification required errors
        if (response.status === 400) {
          let errorText = '';

          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            errorText = data.message || data.error || errorMessage;

            // Check if error requires email verification
            if (
              errorText.toLowerCase().includes('verification code') ||
              errorText.toLowerCase().includes('check your email') ||
              errorText.toLowerCase().includes('verify your email')
            ) {
              // Use React Router navigation instead of window.location
              navigate('/email-confirm', { state: { email } });
              return;
            }
          } else {
            errorText = await response.text();

            // Check if error text requires email verification
            if (
              errorText.toLowerCase().includes('verification code') ||
              errorText.toLowerCase().includes('check your email') ||
              errorText.toLowerCase().includes('verify your email')
            ) {
              // Use React Router navigation instead of window.location
              navigate('/email-confirm', { state: { email } });
              return;
            }
          }

          errorMessage = errorText || errorMessage;
        } else if (contentType && contentType.includes('application/json')) {
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
    } finally {
      setIsLoading(false);
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

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const mainBgColor = isDarkMode ? 'bg-[#192230]' : 'bg-[#f7fbfc]';
  const cardBgColor = isDarkMode ? 'bg-[#1d2939]' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-800';
  const accentColor = '#A8DCE7';

  return (
    <div
      className={`flex flex-col min-h-screen px-4 py-8 sm:px-6 lg:px-8 transition-all duration-300 ${mainBgColor} relative overflow-hidden`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-10 right-10 w-32 h-32 rounded-full opacity-70"
          style={{
            background: `radial-gradient(circle, ${accentColor}80 0%, transparent 70%)`,
            animation: 'float 8s infinite ease-in-out',
          }}
        ></div>
        <div
          className="absolute bottom-20 left-10 w-48 h-48 rounded-full opacity-60"
          style={{
            background: `radial-gradient(circle, ${accentColor}60 0%, transparent 70%)`,
            animation: 'float 10s infinite ease-in-out reverse',
          }}
        ></div>
        <div
          className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)`,
            animation: 'float 15s infinite ease-in-out',
          }}
        ></div>
      </div>

      <div className="w-full max-w-md mx-auto relative z-10">
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/"
            className={`inline-flex items-center text-sm transition-colors hover:text-[#A8DCE7] ${textColor}`}
          >
            <i className="pi pi-chevron-left size-5 mr-1" />
            Back to Home
          </Link>

          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
          >
            <i
              className={`pi ${isDarkMode ? 'pi-sun' : 'pi-moon'} cursor-pointer ${isDarkMode ? 'text-yellow-400' : 'text-gray-800'}`}
              style={{ fontSize: '18px' }}
            ></i>
          </button>
        </div>

        <div
          className={`p-8 rounded-xl shadow-xl z-10 flex flex-col items-center transition-all duration-300 ${cardBgColor} ${textColor}`}
          style={{
            backdropFilter: 'blur(10px)',
            border: `1px solid ${accentColor}40`,
            boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.1), 0 0 10px ${accentColor}40`,
          }}
        >
          {/* Logo/Icon Element */}
          <div className="mb-4 transform hover:scale-105 transition-transform duration-300">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, #84b6bf)`,
              }}
            >
              <i className="pi pi-lock-open text-white text-2xl"></i>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-center">
            Reset Password
          </h2>

          {!isCodeSent && (
            <div className="mb-6 w-full">
              <Label htmlFor="email" className={textColor}>
                Email
              </Label>
              <div className="relative mt-1">
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
                  className={`focus:border-[${accentColor}] focus:ring-[${accentColor}] transition-all duration-300`}
                />
              </div>
              <Button
                onClick={sendVerificationCode}
                className="w-full mt-4 transition-transform transform hover:-translate-y-1 hover:shadow-lg bg-gradient-to-r from-[#A8DCE7] to-[#84b6bf] border-none"
                startIcon={null}
                endIcon={null}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Verification Code'
                )}
              </Button>
            </div>
          )}

          {isCodeSent && !isCodeVerified && (
            <>
              <p className="text-sm text-center text-[#A8DCE7] mb-6 font-medium">
                Verification code sent to: <strong>{email}</strong>
              </p>

              <div className="mb-6 w-full">
                <Label htmlFor="verificationCode" className={textColor}>
                  Enter the 4-digit code
                </Label>
                <div className="flex justify-center gap-3 mt-3">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className={`w-14 h-14 text-center text-xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8DCE7] transition-all duration-200 transform hover:scale-105 ${
                        isDarkMode
                          ? 'bg-gray-700 text-white border-gray-600'
                          : 'border-gray-300'
                      }`}
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

              <div className="space-y-3 w-full">
                <Button
                  onClick={verifyCode}
                  className="w-full transition-transform transform hover:-translate-y-1 hover:shadow-lg bg-gradient-to-r from-[#A8DCE7] to-[#84b6bf] border-none"
                  startIcon={null}
                  endIcon={null}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Verify Code'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={sendVerificationCode}
                  className="w-full text-sm border-[#A8DCE7] text-[#A8DCE7] hover:bg-[#A8DCE7] hover:text-white"
                  startIcon={null}
                  endIcon={null}
                  disabled={isLoading}
                >
                  Resend Code
                </Button>
              </div>
            </>
          )}

          {isCodeVerified && (
            <>
              <div className="mb-4 w-full">
                <Label htmlFor="newPassword" className={textColor}>
                  New Password
                </Label>
                <div className="relative mt-1">
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
                    className={`focus:border-[${accentColor}] focus:ring-[${accentColor}] transition-all duration-300`}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-[#A8DCE7] transition-colors"
                  >
                    <i
                      className={`pi ${showPassword ? 'pi-eye' : 'pi-eye-slash'}`}
                    />
                  </span>
                </div>
              </div>

              <div className="mb-6 w-full">
                <Label htmlFor="rePassword" className={textColor}>
                  Confirm Password
                </Label>
                <div className="relative mt-1">
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
                    className={`focus:border-[${accentColor}] focus:ring-[${accentColor}] transition-all duration-300`}
                  />
                  <span
                    onClick={() => setShowRePassword(!showRePassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-[#A8DCE7] transition-colors"
                  >
                    <i
                      className={`pi ${showRePassword ? 'pi-eye' : 'pi-eye-slash'}`}
                    />
                  </span>
                </div>
              </div>

              <Button
                onClick={resetPassword}
                className="w-full transition-transform transform hover:-translate-y-1 hover:shadow-lg bg-gradient-to-r from-[#A8DCE7] to-[#84b6bf] border-none"
                startIcon={null}
                endIcon={null}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Confirm Password Change'
                )}
              </Button>
            </>
          )}

          {message && (
            <div
              className={`mt-4 text-center text-sm p-3 rounded-lg w-full animate-pulse ${
                messageType === 'error'
                  ? 'text-red-600 bg-red-100 bg-opacity-20'
                  : 'text-green-600 bg-green-100 bg-opacity-20'
              }`}
            >
              {message}
            </div>
          )}

          <div className="mt-6 text-center text-sm">
            <Link
              to="/login"
              className="text-[#A8DCE7] hover:underline transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `,
        }}
      />
    </div>
  );
}
