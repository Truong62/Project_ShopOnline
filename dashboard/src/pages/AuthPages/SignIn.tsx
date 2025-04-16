import PageMeta from '../../components/common/PageMeta';
import SignInForm from '../../components/auth/SignInForm';
import GoogleSignInButton from '../../components/auth/GoogleSignInButton';
import React from 'react';

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Đăng nhập | TailAdmin"
        description="Trang đăng nhập bằng Google hoặc email"
      />
      <div className="max-w-md mx-auto mt-10">
        <SignInForm />

        <div className="my-6 text-center text-gray-500">hoặc</div>

        <GoogleSignInButton />
      </div>
    </>
  );
}
