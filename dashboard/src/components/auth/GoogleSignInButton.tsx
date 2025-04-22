import React from 'react';

declare global {
  interface Window {
    google: any;
  }
}

const CustomGoogleLoginButton: React.FC = () => {
  const handleGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt((response: any) => {
        if (response.credential) {
          // Send the token to your backend for verification
          const token = response.credential;
          fetch('https://18.139.41.39/api/accounts/google-signin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          })
            .then((res) => res.json())
            .then((data) => {
              // Handle the response from your backend
              if (data.success) {
                console.log('Login successful', data);
                // Proceed with user login, redirection, etc.
              } else {
                console.error('Login failed', data);
              }
            })
            .catch((err) => {
              console.error('Error during Google login', err);
            });
        }
      });
    } else {
      console.error('Google SDK is not loaded');
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center gap-2 w-full justify-center border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-100 transition"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        className="w-5 h-5"
      />
      <span className="text-gray-700 font-medium">Sign Up with Google</span>
    </button>
  );
};

export default CustomGoogleLoginButton;
