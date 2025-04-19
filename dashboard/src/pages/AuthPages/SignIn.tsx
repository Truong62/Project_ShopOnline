import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageMeta from '../../components/common/PageMeta';
import SignInForm from '../../components/auth/SignInForm';
import GoogleSignInButton from '../../components/auth/GoogleSignInButton';
interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'product_manager' | 'sale_manager';
  status: 'Active' | 'Inactive';
  createdAt: string;
}

const initialUsers: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    status: 'Active',
    createdAt: new Date('2025-04-01').toISOString(),
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: 'jane123',
    role: 'product_manager',
    status: 'Active',
    createdAt: new Date('2025-04-02').toISOString(),
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    password: 'bob123',
    role: 'sale_manager',
    status: 'Active',
    createdAt: new Date('2025-04-03').toISOString(),
  },
];

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      let users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      console.log('Users in SignIn (before init):', users);

      if (!users.length) {
        console.log('No users found, initializing with default users');
        users = initialUsers;
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Users initialized in localStorage:', users);
      }

      const user = users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
      );
      console.log('Input:', { email, password });
      console.log('Found user:', user);

      if (!user) {
        throw new Error('Invalid email or password');
      }
      if (user.status !== 'Active') {
        throw new Error('Account is inactive');
      }

      localStorage.setItem('user', JSON.stringify(user));
      console.log('User logged in:', user);

      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed');
      console.error('Login error:', err.message);
    }
  };

  return (
    <>
      <PageMeta
        title="Login | TailAdmin"
        description="Login page by Google or email"
      />
      <div className="max-w-md mx-auto mt-10">
        <SignInForm />
      </div>
    </>
  );
};

export default SignIn;
