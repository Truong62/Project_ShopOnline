// dashboard/src/components/common/NotificationModal.tsx
import React from 'react';

interface NotificationModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full">
        <div className="flex items-center mb-4">
          <i className="pi pi-exclamation-triangle text-red-500 mr-2 text-xl" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Warning</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="h-10 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-all duration-200"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;