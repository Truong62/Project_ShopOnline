import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/ui/alert/Alert';

interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  Description?: string | null;
  role: 'admin' | 'product_manager' | 'sale_manager';
  status: 'Active' | 'Inactive';
  createdAt: string;
}

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [description, setDescription] = useState(user?.Description || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alert, setAlert] = useState<{
    show: boolean;
    variant: 'success' | 'error' | 'info';
    title: string;
    message: string;
  }>({
    show: false,
    variant: 'info',
    title: '',
    message: '',
  });

  useEffect(() => {
    if (!user) {
      setAlert({
        show: true,
        variant: 'error',
        title: 'Session Expired',
        message: 'Please sign in again.',
      });
      setTimeout(() => navigate('/sign-in'), 3000);
    }
  }, [user, navigate]);

  const showAlert = (
    variant: 'success' | 'error' | 'info',
    title: string,
    message: string
  ) => {
    setAlert({ show: true, variant, title, message });
    setTimeout(() => {
      setAlert({ show: false, variant: 'info', title: '', message: '' });
    }, 5000);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!name.trim() || name.length < 3) {
      showAlert('error', 'Validation Error', 'Name must be at least 3 characters long.');
      return;
    }

    try {
      const updatedUser: User = {
        ...user,
        name,
        Description: description || null,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));

      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((u) =>
        u.id === user.id ? updatedUser : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      setUser(updatedUser);
      setIsEditing(false);
      showAlert('success', 'Profile Updated', 'Your profile has been updated successfully.');
    } catch (error) {
      console.error('Error updating profile:', error);
      showAlert('error', 'Update Failed', 'Failed to update profile.');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (user.password !== currentPassword) {
      showAlert('error', 'Validation Error', 'Current password is incorrect.');
      return;
    }

    if (newPassword.length < 6) {
      showAlert('error', 'Validation Error', 'New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert('error', 'Validation Error', 'New password and confirmation do not match.');
      return;
    }

    try {
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((u) =>
        u.id === user.id ? { ...u, password: newPassword } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      showAlert('success', 'Password Changed', 'Your password has been updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      showAlert('error', 'Change Failed', 'Failed to change password.');
    }
  };

  if (!user) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        {alert.show && (
          <Alert
            variant={alert.variant}
            title={alert.title}
            message={alert.message}
            showLink={false}
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">User Profile</h2>
      {alert.show && (
        <div className="mb-6">
          <Alert
            variant={alert.variant}
            title={alert.title}
            message={alert.message}
            showLink={false}
          />
        </div>
      )}
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white/90">
            Account Information
          </h3>
          {isEditing ? (
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                  placeholder="Enter your name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  value={description || ''}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-24 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                  placeholder="Enter description"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="h-12 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setName(user.name);
                    setDescription(user.Description || '');
                  }}
                  className="h-12 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Name
                </label>
                <p className="text-gray-900 dark:text-gray-200">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Email
                </label>
                <p className="text-gray-900 dark:text-gray-200">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Description
                </label>
                <p className="text-gray-900 dark:text-gray-200">
                  {user.Description || 'No description provided'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Role
                </label>
                <p className="text-gray-900 dark:text-gray-200">
                  {user.role === 'admin'
                    ? 'Admin'
                    : user.role === 'sale_manager'
                    ? 'Sales Manager'
                    : 'Product Manager'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Status
                </label>
                <p className="text-gray-900 dark:text-gray-200">{user.status}</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="h-12 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white/90">
            Change Password
          </h3>
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Current Password *
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-12 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                placeholder="Enter current password"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                New Password *
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-12 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                placeholder="Enter new password"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Confirm New Password *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                placeholder="Confirm new password"
              />
            </div>
            <button
              type="submit"
              className="h-12 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;