import React, { useState } from 'react';
import Alert from '../../components/ui/alert/Alert';

interface ColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (colorName: string) => void;
  existingColors: string[];
}

const ColorModal: React.FC<ColorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingColors,
}) => {
  const [colorName, setColorName] = useState('');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedColor = colorName.trim();
    if (!trimmedColor) {
      showAlert('error', 'Invalid Color', 'Please enter a color name.');
      return;
    }
    if (
      existingColors.some((c) => c.toLowerCase() === trimmedColor.toLowerCase())
    ) {
      showAlert('error', 'Duplicate Color', 'This color already exists.');
      return;
    }
    onSave(trimmedColor);
    setColorName('');
    onClose();
  };

  const handleClose = () => {
    setColorName('');
    setAlert({ show: false, variant: 'error', title: '', message: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg max-w-md w-full p-6 transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Add New Color
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200 transition-colors duration-300"
          >
            <i className="pi pi-times"></i>
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
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              <i className="pi pi-palette"></i> Color Name *
            </label>
            <input
              type="text"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              className="h-12 w-full rounded-xl border border-gray-200 bg-[#E6F2F5] px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A8DCE7] transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              placeholder="Enter color name (e.g., Purple)"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="h-12 rounded-xl bg-[#A8DCE7] px-6 py-3 text-sm font-medium text-gray-800 hover:bg-[#95C8D2] focus:ring-2 focus:ring-[#A8DCE7] focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 justify-center"
            >
              <i className="pi pi-plus"></i> Save Color
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="h-12 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 justify-center"
            >
              <i className="pi pi-times"></i> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ColorModal;
