import React, { useState, useEffect, useRef } from 'react';
import { Users } from '../../types';
import Alert from '../../components/ui/alert/Alert'; // Adjust the path based on your project structure

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Users) => void;
  brandSuggestions: string[];
  userToEdit?: Users | null;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  userToEdit,
}) => {
  const [avatar, setAvatar] = useState<string | null>(userToEdit?.Avatar || null);
  const [name, setName] = useState(userToEdit?.name || '');
  const [description, setDescription] = useState(userToEdit?.description || '');
  const [status, setStatus] = useState<'Deleted=0' | 'Active' | 'Inactive'>(
    userToEdit?.status || 'Active'
  );
  const [role, setRole] = useState(userToEdit?.role || '');
  // State for managing Alert
  const [alert, setAlert] = useState<{
    show: boolean;
    variant: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  }>({
    show: false,
    variant: 'error',
    title: '',
    message: '',
  });

  const mainImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userToEdit) {
      setAvatar(userToEdit.Avatar);
      setName(userToEdit.name);
      setDescription(userToEdit.description);
      setStatus(userToEdit.status);
      setRole(userToEdit.role);
    }
  }, [userToEdit]);

  // Function to show alert and auto-dismiss after 5 seconds
  const showAlert = (
    variant: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string
  ) => {
    setAlert({ show: true, variant, title, message });
    setTimeout(() => {
      setAlert({ show: false, variant: 'error', title: '', message: '' });
    }, 5000); // Auto-dismiss after 5 seconds
  };

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditMainImage = () => {
    if (mainImageInputRef.current) {
      mainImageInputRef.current.click();
    }
  };

  const handleDeleteMainImage = () => {
    setAvatar(null);
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    let errorMessage = '';

    if (!avatar) {
      errorMessage = 'Main image is required.';
    } else if (!name.trim()) {
      errorMessage = 'Name is required.';
    } else if (!description.trim()) {
      errorMessage = 'Description is required.';
    }

    if (errorMessage) {
      showAlert('error', 'Validation Error', errorMessage);
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const user: Users = {
      id: userToEdit?.id ?? Date.now(),
      name,
      Avatar: avatar!,
      description,
      role,
      status,
      createdAt: userToEdit?.createdAt ?? new Date().toISOString(),
      email: userToEdit?.email || '',
      phone: userToEdit?.phone || '',
      address: userToEdit?.address || '',
    };

    onSave(user);
    showAlert('success', 'Success', userToEdit ? 'User updated successfully!' : 'User added successfully!');
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setAvatar(null);
    setName('');
    setDescription('');
    setRole('');
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
      {/* Render Alert Component */}
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
        {/* Main Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            <i className="pi pi-image mr-2" /> Main Image *
          </label>
          <div className="flex items-center gap-3">
            {avatar ? (
              <div className="relative">
                <img
                  src={avatar || ''}
                  alt="Avatar"
                  className="h-20 w-20 rounded-lg object-cover shadow-sm"
                />
                <button
                  type="button"
                  onClick={handleDeleteMainImage}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center"
                >
                  <i className="pi pi-times text-xs" />
                </button>
                <button
                  type="button"
                  onClick={handleEditMainImage}
                  className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full h-6 w-6 flex items-center justify-center"
                >
                  <i className="pi pi-pencil text-xs" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => mainImageInputRef.current?.click()}
                className="h-20 w-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer"
              >
                <i className="pi pi-plus text-gray-400" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={mainImageInputRef}
              onChange={handleMainImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            <i className="pi pi-tag mr-2" /> Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-all duration-200"
            placeholder="Enter name"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            <i className="pi pi-file mr-2" /> Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-24 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-all duration-200"
            placeholder="Enter description"
          />
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            <i className="pi pi-info-circle mr-2" /> Status *
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'Deleted=0' | 'Active' | 'Inactive')}
            className="h-12 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-all duration-200"
          >
            <option value="Deleted">Deleted</option>
            <option value="Released">Released</option>
            <option value="Unreleased">Unreleased</option>
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
