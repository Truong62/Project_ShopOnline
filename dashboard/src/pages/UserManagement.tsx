import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import PageMeta from '../components/common/PageMeta';
import Header from '../components/user-management/Header';
import FilterUser from '../components/user-management/FilterUser';
import CategoryUser from '../components/user-management/CategoryUser';
import UserTable from '../components/user-management/UserTable';
import Pagination from '../components/product-features/Pagination';
import Alert from '../components/ui/alert/Alert';

interface User {
    id: number;
    Avatar?: string | null;
    Description?: string | null;
    name: string;
    email: string;
    role: 'Admin' | 'User';
    status: 'Active' | 'Inactive';
    createdAt: string;
}

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: User) => void;
    userToEdit?: User | null;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
    isOpen,
    onClose,
    onSave,
    userToEdit,
}) => {
    const [name, setName] = useState(userToEdit?.name || '');
    const [avatar, setAvatar] = useState<string | null>(userToEdit?.Avatar || null);
    const [description, setDescription] = useState(userToEdit?.Description || '');
    const [email, setEmail] = useState(userToEdit?.email || '');
    const [role, setRole] = useState<'Admin' | 'User'>(userToEdit?.role || 'User');
    const [status, setStatus] = useState<'Active' | 'Inactive'>(
        userToEdit?.status || 'Active'
    );

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

    const showAlert = (
        variant: 'success' | 'error' | 'warning' | 'info',
        title: string,
        message: string
    ) => {
        setAlert({ show: true, variant, title, message });
        setTimeout(() => {
            setAlert({ show: false, variant: 'error', title: '', message: '' });
        }, 5000);
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

        const user: User = {
            id: userToEdit?.id ?? Date.now(),
            name,
            email,
            Avatar: avatar,
            Description: description || null,
            role,
            status,
            createdAt: userToEdit?.createdAt ?? new Date().toISOString(),
        };

        onSave(user);
        handleClose();
    };

    const handleClose = () => {
        onClose();
        setName('');
        setAvatar(null);
        setDescription('');
        setEmail('');
        setRole('User');
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
                        <i className="pi pi-image mr-2" /> Avatar
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    setAvatar(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                            } else {
                                setAvatar(userToEdit?.Avatar || null);
                            }
                        }}
                        className="h-12 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-all duration-200"
                    />
                </div>
                {avatar && (
                    <div className="mb-6">
                        <img
                            src={avatar}
                            alt="Avatar Preview"
                            className="h-20 w-20 rounded-lg object-cover shadow-sm"
                        />
                    </div>
                )}
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
                        onChange={(e) => setRole(e.target.value as 'Admin' | 'User')}
                        className="h-12 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-all duration-200"
                    >
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
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


const initialUsers: User[] = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Admin',
        status: 'Active',
        createdAt: new Date('2025-04-01').toISOString(),
        Avatar: null,
        Description: 'Senior Administrator',
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        role: 'User',
        status: 'Active',
        createdAt: new Date('2025-04-02').toISOString(),
        Avatar: null,
        Description: 'Marketing Specialist',
    },
];

const UserFeatures: React.FC = () => {
    const [users, setUsers] = useState<User[]>(() => {
        try {
            const savedUsers = localStorage.getItem('users');
            return savedUsers ? JSON.parse(savedUsers) : initialUsers;
        } catch (error) {
            console.error('Error parsing users from localStorage:', error);
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
    const [filters, setFilters] = useState({
        role: '',
        status: '',
    });
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
                setIsModalOpen(false);
                setIsEditing(false);
                setUserToEdit(null);
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
                setIsModalOpen(false);
                setIsEditing(false);
                setUserToEdit(null);
                showAlert('success', 'User Added', 'User added successfully!');
            }
        } catch (error: any) {
            console.error('Error saving user:', error);
            showAlert('error', 'Error', error.message || 'An error occurred while saving the user.');
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