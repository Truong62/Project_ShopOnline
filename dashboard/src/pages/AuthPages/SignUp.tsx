import PageMeta from '../../components/common/PageMeta';
import AuthLayout from './AuthPageLayout';
import SignUpForm from '../../components/auth/SignUpForm';
import React from 'react';
import GoogleSignUpButton from '../../components/auth/GoogleSignUpButton';

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="React.js SignUp Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js SignUp Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="max-w-md mx-auto mt-10">
        <SignUpForm />

        <div className="my-6 text-center text-gray-500">or</div>

        <GoogleSignUpButton />
      </div>



    </>
  );
}
