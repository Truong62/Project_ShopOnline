import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'product_manager' | 'sale_manager' | 'user';
  createdAt: string;
}

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  userToEdit: User | null;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  userToEdit,
}) => {
  const [formData, setFormData] = useState<User>({
    id: userToEdit?.id || Date.now(),
    name: userToEdit?.name || '',
    email: userToEdit?.email || '',
    password: userToEdit?.password || '',
    role: userToEdit?.role || 'user',
    createdAt: userToEdit?.createdAt || new Date().toISOString(),
  });
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState<User | null>(null);
  const [errors, setErrors] = useState({ email: '', name: '', role: '' });
  const [isEmailDisabled, setIsEmailDisabled] = useState(false);

  const roles = [
    { label: 'User', value: 'user' },
    { label: 'Admin', value: 'admin' },
    { label: 'Product Manager', value: 'product_manager' },
    { label: 'Sale Manager', value: 'sale_manager' },
  ];

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSearchEmail = () => {
    try {
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find(
        (u) =>
          u.email.toLowerCase() === searchEmail.toLowerCase() &&
          u.role === 'user' // Chỉ tìm tài khoản khách hàng
      );
      if (foundUser) {
        setSearchResult(foundUser);
        setFormData({
          ...formData,
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
          createdAt: foundUser.createdAt,
        });
        setIsEmailDisabled(true); // Vô hiệu hóa trường email
        setErrors({ email: '', name: '', role: '' });
      } else {
        setSearchResult(null);
        setErrors({ ...errors, email: 'Customer account not found' });
      }
    } catch (error) {
      console.error('Error searching email:', error);
      setErrors({ ...errors, email: 'Error searching email' });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | { value: string; name: string }
  ) => {
    const { name, value } = 'target' in e ? e.target : e;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleRevokeRole = () => {
    if (formData.email === 'admin@example.com') {
      setErrors({ ...errors, role: 'Cannot revoke admin role' });
      return;
    }
    setFormData((prev) => ({ ...prev, role: 'user' }));
  };

  const handleSubmit = () => {
    let newErrors = { email: '', name: '', role: '' };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!formData.name) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (formData.email === 'admin@example.com' && formData.role !== 'admin') {
      newErrors.role = 'Admin account role cannot be changed';
      isValid = false;
    }

    setErrors(newErrors);
    if (isValid) {
      // Loại bỏ password nếu không cần thiết
      const { password, ...userData } = formData;
      onSave(userData);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        id: Date.now(),
        name: '',
        email: '',
        password: '',
        role: 'user',
        createdAt: new Date().toISOString(),
      });
      setSearchEmail('');
      setSearchResult(null);
      setErrors({ email: '', name: '', role: '' });
      setIsEmailDisabled(false);
    }
  }, [isOpen]);

  return (
    <Dialog
      header={userToEdit ? 'Edit User' : 'Manage Customer Account'}
      visible={isOpen}
      modal={true}
      style={{ width: '30rem' }}
      onHide={onClose}
      className="bg-white rounded-lg shadow-lg border border-[#A8DCE7]"
      pt={{
        root: { className: 'p-0' },
        content: { className: 'p-4 bg-[#E6F2F5]' },
        header: { className: 'bg-[#A8DCE7] text-white p-4 rounded-t-lg' },
        mask: { className: 'bg-black/50' },
      }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-800">
            Search Customer Email
          </label>
          <div className="flex gap-2">
            <InputText
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Enter customer email to search"
              className="w-full p-2 rounded-md border border-gray-300 bg-white"
              disabled={isEmailDisabled}
            />
            <Button
              label="Search"
              onClick={handleSearchEmail}
              className="bg-[#A8DCE7] text-white p-2 rounded-md hover:bg-[#79c2d2]"
              disabled={isEmailDisabled}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
          {searchResult && (
            <div className="mt-2 text-sm text-gray-700 bg-white p-2 rounded-md border border-gray-300">
              <p>Name: {searchResult.name}</p>
              <p>Email: {searchResult.email}</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-800">
            Name <span className="text-red-500">*</span>
          </label>
          <InputText
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            className="w-full p-2 rounded-md border border-gray-300 bg-white"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-800">
            Email <span className="text-red-500">*</span>
          </label>
          <InputText
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="w-full p-2 rounded-md border border-gray-300 bg-white"
            disabled={isEmailDisabled || !!userToEdit}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-800">
            Role <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="role"
            value={formData.role}
            options={roles}
            onChange={(e) => handleChange({ name: 'role', value: e.value })}
            placeholder="Select role"
            className="w-full rounded-md border border-gray-300 bg-white"
            disabled={formData.email === 'admin@example.com'}
          />
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
          )}
        </div>

        <div className="flex justify-between items-center mt-6">
          {/* Nút Revoke Role ở góc trái */}
          {formData.role !== 'user' &&
            formData.email !== 'admin@example.com' && (
              <Button
                label="Revoke Role"
                className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600"
                severity="warning"
                onClick={handleRevokeRole}
              />
            )}

          {/* Nút Save và Cancel ở góc phải */}
          <div className="flex gap-2">
            <Button
              label="Cancel"
              onClick={onClose}
              severity="secondary"
              className="bg-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-400"
            />
            <Button
              label="Save"
              onClick={handleSubmit}
              className="bg-[#A8DCE7] text-white p-2 rounded-md hover:bg-[#79c2d2]"
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default UserFormModal;
