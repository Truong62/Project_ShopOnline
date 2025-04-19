import React from 'react';

declare global {
  interface Window {
    google: any;
  }
}

const CustomGoogleRegisterButton: React.FC = () => {
  const handleGoogleRegister = () => {
    if (window.google) {
      window.google.accounts.id.prompt(); // Mở popup chọn tài khoản
    } else {
      console.error('Google SDK chưa sẵn sàng');
    }
  };

  return (
    <button
      onClick={handleGoogleRegister}
      className="flex items-center gap-2 w-full justify-center border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-100 transition"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        className="w-5 h-5"
      />
      <span className="text-gray-700 font-medium">Sign up with Google</span>
    </button>
  );
};

export default CustomGoogleRegisterButton;
