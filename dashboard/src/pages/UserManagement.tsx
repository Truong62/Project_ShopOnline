import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import PageMeta from '../components/common/PageMeta';
import Header from '../components/user-management/Header';
import FilterUser from '../components/user-management/FilterUser';
import CategoryUser from '../components/user-management/CategoryUser';
import UserTable from '../components/user-management/UserTable';
import Pagination from '../components/product-features/Pagination';
import Alert from '../components/ui/alert/Alert';
import UserFormModal from '../components/user-management/UserModal';

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

const initialUsers: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    status: 'Active',
    createdAt: new Date('2025-04-01').toISOString(),
    Description: 'Senior Administrator',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: 'jane123',
    role: 'product_manager',
    status: 'Active',
    createdAt: new Date('2025-04-02').toISOString(),
    Description: 'Product Management Specialist',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    password: 'bob123',
    role: 'sale_manager',
    status: 'Active',
    createdAt: new Date('2025-04-03').toISOString(),
    Description: 'Sales Team Lead',
  },
];

const UserFeatures: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const savedUsers = localStorage.getItem('users');
      if (!savedUsers) {
        console.log('Initializing users in UserFeatures:', initialUsers);
        localStorage.setItem('users', JSON.stringify(initialUsers));
        return initialUsers;
      }
      return JSON.parse(savedUsers);
    } catch (error) {
      console.error('Error parsing users from localStorage:', error);
      localStorage.setItem('users', JSON.stringify(initialUsers));
      return initialUsers;
    }
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const usersPerPage = 7;
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [filters, setFilters] = useState({ role: '', status: '' });
  const toast = useRef<Toast>(null);
  const [alert, setAlert] = useState<{
    show: boolean;
    variant: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  }>({
    show: false,
    variant: 'info',
    title: '',
    message: '',
  });

  useEffect(() => {
    try {
      localStorage.setItem('users', JSON.stringify(users));
      console.log('Users saved in UserFeatures:', users); // Debug
    } catch (error) {
      console.error('Error saving users to localStorage:', error);
      showAlert('error', 'Storage Error', 'Failed to save users to local storage.');
    }
  }, [users]);

  const showAlert = (
    variant: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string
  ) => {
    setAlert({ show: true, variant, title, message });
    setTimeout(() => {
      setAlert({ show: false, variant: 'info', title: '', message: '' });
    }, 5000);
  };

  const getFilteredAndSortedUsers = () => {
    let filteredUsers = [...users];

    if (searchTerm) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.role) {
      filteredUsers = filteredUsers.filter((user) => user.role === filters.role);
    }

    if (filters.status) {
      filteredUsers = filteredUsers.filter((user) => user.status === filters.status);
    }

    if (sortOption) {
      filteredUsers.sort((a, b) => {
        if (sortOption === 'name-asc') {
          return a.name.localeCompare(b.name);
        } else if (sortOption === 'name-desc') {
          return b.name.localeCompare(a.name);
        } else if (sortOption === 'email-asc') {
          return a.email.localeCompare(b.email);
        } else if (sortOption === 'email-desc') {
          return b.email.localeCompare(a.email);
        } else if (sortOption === 'date-newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortOption === 'date-oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return 0;
      });
    }

    return filteredUsers;
  };

  const filteredAndSortedUsers = getFilteredAndSortedUsers();
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredAndSortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredAndSortedUsers.length / usersPerPage);

  const handleDelete = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
    showAlert('success', 'User Deleted', 'User was successfully deleted.');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddUser = () => {
    setIsEditing(false);
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setIsEditing(true);
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = (newUser: User) => {
    try {
      if (isEditing && userToEdit) {
        setUsers(users.map((u) => (u.id === newUser.id ? newUser : u)));
        showAlert('success', 'User Updated', 'User updated successfully!');
      } else {
        const existingUser = users.find(
          (u) => u.email.toLowerCase() === newUser.email.toLowerCase() && u.id !== newUser.id
        );
        if (existingUser) {
          showAlert('error', 'Duplicate User', 'A user with this email already exists.');
          return;
        }
        setUsers([...users, newUser]);
        showAlert('success', 'User Added', `User added successfully! A password has been sent to ${newUser.email}.`);
      }
      setIsModalOpen(false);
      setIsEditing(false);
      setUserToEdit(null);
    } catch (error: any) {
      console.error('Error saving user:', error);
      showAlert('error', 'Error', 'Failed to save user.');
    }
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const handleSort = (sortOption: string) => {
    setSortOption(sortOption);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: { role: string; status: string }) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <>
      <PageMeta
        title="User Management | TailAdmin - React.js Admin Dashboard Template"
        description="Manage users in TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Toast ref={toast} />
        <Header />
        <FilterUser
          onAddUser={handleAddUser}
          onSearch={handleSearch}
          onSort={handleSort}
        />
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
        {isModalOpen ? (
          <div className="flex justify-center mb-6">
            <UserFormModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveUser}
              userToEdit={userToEdit}
            />
          </div>
        ) : (
          <>
            <CategoryUser onFilterChange={handleFilterChange} />
            <UserTable users={currentUsers} onDelete={handleDelete} onEdit={handleEditUser} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </>
  );
};

export default UserFeatures;