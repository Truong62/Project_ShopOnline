import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
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
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Sign In</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="h-12 w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;