import React, { useState } from 'react';
import AccountManagement from './AccountManagement';
import ProductManagement from './ProductManagement';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'account' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => setActiveTab('account')}
        >
          Account Management
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'products' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => setActiveTab('products')}
        >
          Product Management
        </button>
      </div>

      <div className="bg-white p-6 shadow-md rounded-lg">
        {activeTab === 'account' ? (
          <AccountManagement />
        ) : (
          <ProductManagement />
        )}
      </div>
    </div>
  );
}
