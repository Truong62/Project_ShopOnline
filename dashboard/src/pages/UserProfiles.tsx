import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/ui/alert/Alert';
import {
  FiUser,
  FiMail,
  FiLock,
  FiEdit,
  FiSave,
  FiX,
  FiKey,
  FiInfo,
  FiShield,
  FiCheckSquare,
} from 'react-icons/fi';

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
      showAlert(
        'error',
        'Validation Error',
        'Name must be at least 3 characters long.'
      );
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
      showAlert(
        'success',
        'Profile Updated',
        'Your profile has been updated successfully.'
      );
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
      showAlert(
        'error',
        'Validation Error',
        'New password must be at least 6 characters long.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert(
        'error',
        'Validation Error',
        'New password and confirmation do not match.'
      );
      return;
    }

    try {
      const response = async () => {
        await fetch('https://18.139.41.39:443/api/accounts/password-change', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        });

        const data = await response;

        // giả sử roles là array string: ['user', 'staff']API endpoint
      };
      showAlert(
        'success',
        'Password Changed',
        'Your password has been updated successfully.'
      );
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
      <div className="p-6 bg-[#F1F9FB] dark:bg-gray-800 min-h-screen transition-colors duration-300">
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
    <div className="p-4 sm:p-6 md:p-8 bg-[#F1F9FB] dark:bg-gray-800 min-h-screen transition-colors duration-300 flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 transition-colors duration-300">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <FiUser className="text-[#A8DCE7]" /> User Profile
          </h2>
        </div>

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

        <div className="mb-10">
          <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <FiInfo className="text-[#A8DCE7]" /> Account Information
          </h3>
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <FiUser className="text-[#A8DCE7] text-lg" />
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  Name
                </label>
                <p className="text-gray-800 dark:text-gray-200">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiMail className="text-[#A8DCE7] text-lg" />
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  Email
                </label>
                <p className="text-gray-800 dark:text-gray-200">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiShield className="text-[#A8DCE7] text-lg" />
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  Role
                </label>
                <p className="text-gray-800 dark:text-gray-200">
                  {user.role === 'admin'
                    ? 'Admin'
                    : user.role === 'sale_manager'
                      ? 'Sales Manager'
                      : 'Product Manager'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <FiKey className="text-[#A8DCE7]" /> Change Password
          </h3>
          <div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2">
                <FiLock className="text-[#A8DCE7]" /> Current Password *
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-200 bg-[#E6F2F5] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8DCE7] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 transition-colors duration-300"
                placeholder="Enter current password"
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2">
                <FiLock className="text-[#A8DCE7]" /> New Password *
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-200 bg-[#E6F2F5] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8DCE7] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 transition-colors duration-300"
                placeholder="Enter new password"
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2">
                <FiLock className="text-[#A8DCE7]" /> Confirm New Password *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-200 bg-[#E6F2F5] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8DCE7] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 transition-colors duration-300"
                placeholder="Confirm new password"
              />
            </div>
            <button
              type="submit"
              onClick={handlePasswordSubmit}
              className="h-12 rounded-xl bg-[#A8DCE7] px-6 py-3 text-sm font-medium text-gray-800 hover:bg-[#95C8D2] focus:ring-2 focus:ring-[#A8DCE7] focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 justify-center w-full sm:w-auto"
            >
              <FiKey /> Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
