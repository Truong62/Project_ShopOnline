import PageMeta from '../../components/common/PageMeta';
import SignInForm from '../../components/auth/SignInForm';
import GoogleSignInButton from '../../components/auth/GoogleSignInButton';
import React from 'react';

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Login | TailAdmin"
        description="Login page by Google or email"
      />
      <div className="max-w-md mx-auto mt-10">
        <SignInForm />

        <div className="my-6 text-center text-gray-500">or</div>

        <GoogleSignInButton />
      </div>
    </>
  );
}
