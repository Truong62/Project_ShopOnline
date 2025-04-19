import React, { useState } from 'react';
import Alert from '../../components/ui/alert/Alert';
import { generatePassword } from '../utils/generatePassword';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  userToEdit?: User | null;
}

interface User {
  id: number;
  Description?: string | null;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'product_manager' | 'sale_manager';
  status: 'Active' | 'Inactive';
  createdAt: string;
}

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'product_manager', label: 'Product Manager' },
  { value: 'sale_manager', label: 'Sales Manager' },
];

const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  userToEdit,
}) => {
  const [name, setName] = useState(userToEdit?.name || '');
  const [description, setDescription] = useState(userToEdit?.Description || '');
  const [email, setEmail] = useState(userToEdit?.email || '');
  const [role, setRole] = useState<'admin' | 'product_manager' | 'sale_manager'>(
    userToEdit?.role || 'admin'
  );
  const [status, setStatus] = useState<'Active' | 'Inactive'>(
    userToEdit?.status || 'Active'
  );
  const [alert, setAlert] = useState<{
    show: boolean;
    variant: 'success' | 'error' | 'info';
    title: string;
    message: string;
  }>({
    show: false,
    variant: 'error',
    title: '',
    message: '',
  });

  const showAlert = (
    variant: 'success' | 'error' | 'info',
    title: string,
    message: string
  ) => {
    setAlert({ show: true, variant, title, message });
    setTimeout(() => {
      setAlert({ show: false, variant: 'error', title: '', message: '' });
    }, 8000);
  };

  const validateForm = () => {
    if (!name.trim()) {
      showAlert('error', 'Validation Error', 'Name is required.');
      return false;
    }
    if (name.length < 3) {
      showAlert('error', 'Validation Error', 'Name must be at least 3 characters long.');
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showAlert('error', 'Validation Error', 'A valid email is required.');
      return false;
    }
    if (email.length < 5) {
      showAlert('error', 'Validation Error', 'Email must be at least 5 characters long.');
      return false;
    }
    if (!role) {
      showAlert('error', 'Validation Error', 'Role is required.');
      return false;
    }
    if (!status) {
      showAlert('error', 'Validation Error', 'Status is required.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const isNewUser = !userToEdit;
    const generatedPassword = isNewUser ? generatePassword() : undefined;

    const user: User = {
      id: userToEdit?.id ?? Date.now(),
      name,
      email,
      Description: description || null,
      role,
      status,
      createdAt: userToEdit?.createdAt ?? new Date().toISOString(),
      password: isNewUser ? generatedPassword : userToEdit?.password,
    };

    onSave(user);

    if (isNewUser && generatedPassword) {
      showAlert(
        'success',
        'User Added',
        `User created successfully! The password "${generatedPassword}" has been sent to ${user.email}.`
      );
    } else {
      showAlert('success', 'User Updated', 'User updated successfully!');
    }

    handleClose();
  };

  const handleClose = () => {
    onClose();
    setName('');
    setDescription('');
    setEmail('');
    setRole('admin');
    setStatus('Active');
    setAlert({ show: false, variant: 'error', title: '', message: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-2xl w-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
          {userToEdit ? 'Edit User' : 'Add New User'}
        </h2>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <i className="pi pi-times text-xl" />
        </button>
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
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            <i className="pi pi-user mr-2" /> Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-all duration-200"
            placeholder="Enter user name"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            <i className="pi pi-comment mr-2" /> Description
          </label>
          <textarea
            value={description || ''}
            onChange={(e) => setDescription(e.target.value)}
            className="h-24 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-all duration-200"
            placeholder="Enter user description"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            <i className="pi pi-envelope mr-2" /> Email *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-all duration-200"
            placeholder="Enter email address"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            <i className="pi pi-shield mr-2" /> Role *
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'admin' | 'product_manager' | 'sale_manager')}
            className="h-12 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-all duration-200"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            <i className="pi pi-info-circle mr-2" /> Status *
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
            className="h-12 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-all duration-200"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="h-12 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-md hover:bg-blue-700 transition-all duration-200"
          >
            <i className="pi pi-check mr-2" /> {userToEdit ? 'Update User' : 'Save User'}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="h-12 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <i className="pi pi-times mr-2" /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserFormModal;