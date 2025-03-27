import { useState, useEffect } from 'react';
// import userData from '../user.json';
import './styles/custom-button.css';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../components/Form/Input';
import GoogleSignInButton from '../components/Form/GG';
import React from 'react';
import ChatPopup from '../components/Chat/ChatPopup';
export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const errorMessages = {
    emailRequired: { message: '* Email is required', color: 'red' },
    emailInvalid: { message: '* Email is invalid', color: 'red' },
    emailNotExist: { message: '* Email does not exist', color: 'red' },
    passwordRequired: { message: '* Password is required', color: 'red' },
    incorrectPassword: { message: '* Incorrect Password', color: 'red' },
  };

  const handleFocus = (field) => {
    if (field === 'email') {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;

    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError(errorMessages.emailRequired.message);
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(errorMessages.emailInvalid.message);
      valid = false;
    }

    if (!password) {
      setPasswordError(errorMessages.passwordRequired.message);
      valid = false;
    }

    if (!valid) return;

    try {
      const response = await fetch(
        'https://localhost:3000/api/accounts/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      let data;
      const text = await response.text();

      try {
        data = JSON.parse(text);
      } catch {
        console.error('Invalid JSON response:', text);
        throw new Error('Server returned an invalid response');
      }

      if (response.status === 401) {
        if (data.error === 'Email does not exist') {
          setEmailError(errorMessages.emailNotExist.message);
        } else if (data.error === 'Incorrect password') {
          setPasswordError(errorMessages.incorrectPassword.message);
        } else {
          setPasswordError('* Invalid email or password');
        }
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || `Error: ${response.status}`);
      }

      console.log('Login successful:', data);
      if (data.role === 'admin') {
        navigate('/admin/dashboard'); // Chuyển hướng đến Admin Dashboard
      } else if (data.role === 'sales') {
        navigate('/sales/dashboard'); // Chuyển hướng đến Sales Dashboard (nếu có)
      } else {
        console.error('Unauthorized role:', data.role);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setPasswordError('Something went wrong. Please try again.');
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      document.body.style.overflow = 'unset';
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center min-h-screen ${isDarkMode ? 'bg-[rgba(19,19,26,1)]' : 'bg-white'}`}
      style={{
        padding: '24px',
        gap: '10px',
        opacity: '1',
      }}
    >
      <div className="absolute top-4 right-4">
        <i
          className={`pi pi-lightbulb cursor-pointer ${isDarkMode ? 'text-yellow-500' : 'text-gray-800'}`}
          style={{ fontSize: '2rem' }}
          onClick={toggleDarkMode}
        ></i>
      </div>
      <div
        className="absolute w-full h-full bottom-0 transform translate-y-1/2"
        style={{
          background: 'url(/images/Ellipse65.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
      <div
        className={`p-8 rounded-lg w-full max-w-[556px] h-auto shadow-lg z-10 flex flex-col items-center ${isDarkMode ? 'bg-[rgba(28,28,36,1)] text-white' : 'bg-white text-black'}`}
      >
        <h2 className="text-2xl font-bold text-center ">Welcome Back!</h2>
        <p
          className="text-center mb-2"
          style={{ color: 'rgba(128, 129, 145, 1)' }}
        >
          Don{'  '}t have an account?{' '}
          <Link to="/signup" className="text-green-500">
            Sign up
          </Link>
        </p>

        <GoogleSignInButton />

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center gap-y-3"
          style={{ fontFamily: 'Epilogue' }}
        >
          <div className="w-full flex flex-col items-center">
            <InputField
              label="Email *"
              type="text"
              value={email}
              placeholder="example@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => handleFocus('email')}
              className={`w-full p-2 rounded-md mb-2 ${emailError ? 'border-red-500 text-red-500' : 'border-gray-300'}`}
              isDarkMode={isDarkMode}
            />
            <div className="text-red-500 text-sm text-left w-full min-h-[24px] pl-7">
              {emailError || '\u00A0'}
            </div>
          </div>

          <div className="w-full flex flex-col items-center">
            <InputField
              label="Password *"
              type="password"
              value={password}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => handleFocus('password')}
              showPassword={showPassword}
              togglePasswordVisibility={() => setShowPassword(!showPassword)}
              className={`w-full p-2 rounded-md mb-2 ${passwordError ? 'border-red-500 text-red-500' : 'border-gray-300'}`}
              isDarkMode={isDarkMode}
            />
            <div className="text-red-500 text-sm text-left w-full min-h-[24px] pl-7">
              {passwordError || '\u00A0'}
            </div>
          </div>

          <div className="mb-2 w-full flex justify-end">
            <Link to="/forgotpassword" className="text-green-500">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full custom-button text-white py-3 rounded-lg hover:bg-green-700"
            style={{
              height: '52px',
              opacity: '1',
              backgroundColor: 'rgba(29, 192, 113, 1)',
            }}
          >
            Sign in
          </button>
        </form>
        <ChatPopup />
      </div>
    </div>
  );
}
