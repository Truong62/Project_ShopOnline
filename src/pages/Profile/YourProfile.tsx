import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../../../dashboard/src/components/ui/alert/Alert';
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
  FiSettings,
  FiCalendar,
  FiArrowLeft,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Define primary colors
const primaryColor = 'rgb(65, 179, 199)';
const primaryColorLight = 'rgba(65, 179, 199, 0.2)';
const primaryColorDark = 'rgb(45, 159, 179)';

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
  const initialUser = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')!)
    : localStorage.getItem('loggedInUser')
      ? { email: localStorage.getItem('userEmail') }
      : null;

  const [user, setUser] = useState<User | null>(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [description, setDescription] = useState(user?.Description || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'password'
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
  const [password, setPassword] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

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

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
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

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loggedInUser = localStorage.getItem('loggedInUser');
    const token = loggedInUser ? JSON.parse(loggedInUser).accessToken : null;

    if (!token) {
      showAlert(
        'error',
        'Authorization Error',
        'You are not logged in or your token is invalid.'
      );
      return;
    }

    try {
      const response = await fetch(
        'https://18.139.41.39:444/api/accounts/password-change',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            password: password.oldPassword,
            newPassword: password.newPassword,
            confirmNewPassword: password.confirmNewPassword,
          }),
        }
      );

      // Check if response is not JSON
      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('Could not parse JSON:', jsonError);
        data = { message: 'Invalid data from server.' };
      }

      if (response.ok) {
        showAlert('success', 'Success', 'Password changed successfully!');
        setPassword({
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
      } else {
        showAlert(
          'error',
          'Error',
          data.message || 'Failed to change password.'
        );
      }
    } catch (error) {
      console.error('Password change error:', error);
      showAlert('error', 'Error', 'An error occurred while changing password.');
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[rgba(65,179,199,0.1)] p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[rgba(65,179,199,0.1)] rounded-full mb-4">
              <FiUser className="text-[rgb(65,179,199)] text-2xl" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Profile Not Found
            </h2>
            <p className="text-gray-600 mt-2">
              Please login to view your profile information
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-[rgb(65,179,199)] text-white py-3 rounded-xl font-medium transition-all hover:bg-[rgb(45,159,179)] shadow-md hover:shadow-lg"
              onClick={() => navigate('/login')}
            >
              Login
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full border-2 border-gray-200 py-3 rounded-xl font-medium transition-all hover:border-gray-300 text-gray-700 flex items-center justify-center"
              onClick={handleGoBack}
            >
              <FiArrowLeft className="mr-2" /> Go Back
            </motion.button>
          </div>

          {alert.show && (
            <div className="mt-4">
              <Alert
                variant={alert.variant}
                title={alert.title}
                message={alert.message}
                showLink={false}
              />
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[rgba(65,179,199,0.1)] p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Back button */}
        <div className="px-6 pt-6">
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoBack}
            className="flex items-center text-gray-600 hover:text-[rgb(65,179,199)] transition-colors mb-2"
          >
            <FiArrowLeft className="mr-2" /> Back
          </motion.button>
        </div>

        {/* Header Section */}
        <div className="bg-[rgb(65,179,199)] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path d="M0,0 L100,0 C80,40 60,80 0,100 Z" fill="white" />
            </svg>
          </div>

          <div className="flex items-center z-10 mb-4 sm:mb-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full shadow-lg flex items-center justify-center mr-4">
              <FiUser className="text-[rgb(65,179,199)] text-3xl sm:text-4xl" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {user.name || 'User'}
              </h2>
              <p className="text-[rgba(255,255,255,0.8)] flex items-center">
                <FiMail className="mr-1" /> {user.email}
              </p>
            </div>
          </div>

          <div className="flex z-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center ${
                activeTab === 'profile'
                  ? 'bg-white text-[rgb(65,179,199)]'
                  : 'bg-transparent text-white border border-white'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <FiUser className="mr-2" /> Profile
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`ml-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center ${
                activeTab === 'password'
                  ? 'bg-white text-[rgb(65,179,199)]'
                  : 'bg-transparent text-white border border-white'
              }`}
              onClick={() => setActiveTab('password')}
            >
              <FiKey className="mr-2" /> Password
            </motion.button>
          </div>
        </div>

        {/* Alert Section */}
        <AnimatePresence>
          {alert.show && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="px-6 pt-6"
            >
              <Alert
                variant={alert.variant}
                title={alert.title}
                message={alert.message}
                showLink={false}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Section */}
        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' ? (
              <motion.div
                key="profile"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-between mb-6"
                >
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center">
                    <FiInfo className="text-[rgb(65,179,199)] mr-2" />
                    Account Information
                  </h3>

                  {!isEditing && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center px-4 py-2 bg-[rgb(65,179,199)] text-white rounded-lg transition-all hover:bg-[rgb(45,159,179)] shadow-md"
                    >
                      <FiEdit className="mr-2" /> Edit
                    </motion.button>
                  )}
                </motion.div>

                {isEditing ? (
                  <motion.form variants={containerVariants}>
                    <motion.div variants={itemVariants} className="mb-5">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FiUser className="text-[rgb(65,179,199)] mr-2" /> Name
                        *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-[rgb(65,179,199)] focus:outline-none focus:ring-2 focus:ring-[rgba(65,179,199,0.3)] transition-all"
                        placeholder="Enter your name"
                      />
                    </motion.div>
                    <motion.div variants={itemVariants} className="mb-5">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FiInfo className="text-[rgb(65,179,199)] mr-2" />{' '}
                        Description
                      </label>
                      <textarea
                        value={description || ''}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-[rgb(65,179,199)] focus:outline-none focus:ring-2 focus:ring-[rgba(65,179,199,0.3)] transition-all min-h-[120px]"
                        placeholder="Enter description about yourself"
                      />
                    </motion.div>
                    <motion.div
                      variants={itemVariants}
                      className="flex flex-col sm:flex-row gap-3"
                    >
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        onClick={handleEditSubmit}
                        className="px-6 py-3 bg-[rgb(65,179,199)] text-white rounded-xl font-medium transition-all hover:bg-[rgb(45,159,179)] shadow-md flex items-center justify-center"
                      >
                        <FiSave className="mr-2" /> Save Changes
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setName(user.name);
                          setDescription(user.Description || '');
                        }}
                        className="px-6 py-3 border-2 border-gray-200 bg-white text-gray-700 rounded-xl font-medium transition-all hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center"
                      >
                        <FiX className="mr-2" /> Cancel
                      </motion.button>
                    </motion.div>
                  </motion.form>
                ) : (
                  <motion.div
                    variants={containerVariants}
                    className="bg-[rgba(65,179,199,0.05)] rounded-2xl p-6"
                  >
                    <motion.div
                      variants={itemVariants}
                      className="flex items-start mb-6"
                    >
                      <div className="mt-1 bg-[rgba(65,179,199,0.1)] p-2 rounded-full mr-4">
                        <FiUser className="text-[rgb(65,179,199)] text-lg" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          Name
                        </h4>
                        <p className="text-gray-800 font-medium text-lg">
                          {user.name}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="flex items-start mb-6"
                    >
                      <div className="mt-1 bg-[rgba(65,179,199,0.1)] p-2 rounded-full mr-4">
                        <FiMail className="text-[rgb(65,179,199)] text-lg" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          Email
                        </h4>
                        <p className="text-gray-800 font-medium text-lg">
                          {user.email}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="flex items-start mb-6"
                    >
                      <div className="mt-1 bg-[rgba(65,179,199,0.1)] p-2 rounded-full mr-4">
                        <FiShield className="text-[rgb(65,179,199)] text-lg" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          Role
                        </h4>
                        <p className="text-gray-800 font-medium text-lg">
                          {user.role === 'admin'
                            ? 'Administrator'
                            : user.role === 'product_manager'
                              ? 'Product Manager'
                              : 'Sales Manager'}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="flex items-start mb-6"
                    >
                      <div className="mt-1 bg-[rgba(65,179,199,0.1)] p-2 rounded-full mr-4">
                        <FiSettings className="text-[rgb(65,179,199)] text-lg" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          Status
                        </h4>
                        <div className="flex items-center">
                          <span
                            className={`inline-block w-2 h-2 rounded-full mr-2 ${
                              user.status === 'Active'
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            }`}
                          ></span>
                          <p className="text-gray-800 font-medium text-lg">
                            {user.status === 'Active' ? 'Active' : 'Inactive'}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {user.Description && (
                      <motion.div
                        variants={itemVariants}
                        className="flex items-start"
                      >
                        <div className="mt-1 bg-[rgba(65,179,199,0.1)] p-2 rounded-full mr-4">
                          <FiInfo className="text-[rgb(65,179,199)] text-lg" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">
                            Description
                          </h4>
                          <p className="text-gray-700">{user.Description}</p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="password"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div variants={itemVariants}>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <FiKey className="text-[rgb(65,179,199)] mr-2" /> Change
                    Password
                  </h3>
                  <form
                    onSubmit={handlePasswordSubmit}
                    className="bg-[rgba(65,179,199,0.05)] rounded-2xl p-6"
                  >
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FiLock className="text-[rgb(65,179,199)] mr-2" />{' '}
                        Current Password *
                      </label>
                      <input
                        type="password"
                        value={password.oldPassword}
                        onChange={(e) =>
                          setPassword({
                            ...password,
                            oldPassword: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-[rgb(65,179,199)] focus:outline-none focus:ring-2 focus:ring-[rgba(65,179,199,0.3)] transition-all"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FiKey className="text-[rgb(65,179,199)] mr-2" /> New
                        Password *
                      </label>
                      <input
                        type="password"
                        value={password.newPassword}
                        onChange={(e) =>
                          setPassword({
                            ...password,
                            newPassword: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-[rgb(65,179,199)] focus:outline-none focus:ring-2 focus:ring-[rgba(65,179,199,0.3)] transition-all"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FiCheckSquare className="text-[rgb(65,179,199)] mr-2" />{' '}
                        Confirm New Password *
                      </label>
                      <input
                        type="password"
                        value={password.confirmNewPassword}
                        onChange={(e) =>
                          setPassword({
                            ...password,
                            confirmNewPassword: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-[rgb(65,179,199)] focus:outline-none focus:ring-2 focus:ring-[rgba(65,179,199,0.3)] transition-all"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <div className="flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        className="px-6 py-3 bg-[rgb(65,179,199)] text-white rounded-xl font-medium transition-all hover:bg-[rgb(45,159,179)] shadow-md flex items-center justify-center min-w-[200px]"
                      >
                        <FiSave className="mr-2" /> Save Password
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;
