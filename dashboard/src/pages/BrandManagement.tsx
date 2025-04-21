import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import PageMeta from '../components/common/PageMeta';
import Header from '../components/product-features/Header';
import Pagination from '../components/product-features/Pagination';
import Alert from '../components/ui/alert/Alert';

interface Brand {
  id: number;
  name: string;
  images: string[];
  createdAt: string;
}

const initialBrands: Brand[] = [
  {
    id: 1,
    name: 'GABRIELA',
    images: [],
    createdAt: new Date('2025-04-01').toISOString(),
  },
];

const BrandManagement: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>(() => {
    const savedBrands = localStorage.getItem('brands');
    return savedBrands ? JSON.parse(savedBrands) : initialBrands;
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [brandToEdit, setBrandToEdit] = useState<Brand | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [tempImages, setTempImages] = useState<string[]>([]);
  const brandsPerPage = 7;
  const [searchTerm, setSearchTerm] = useState('');
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
    localStorage.setItem('brands', JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    if (isModalOpen || isDeleteModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen, isDeleteModalOpen]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      const fileArray = Array.from(files).slice(0, 4); // Giới hạn tối đa 4 ảnh
      let loadedImages = 0;

      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          loadedImages++;
          if (loadedImages === fileArray.length) {
            setTempImages(newImages);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const getFilteredBrands = () => {
    let filteredBrands = [...brands];

    if (searchTerm) {
      filteredBrands = filteredBrands.filter((brand) =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredBrands;
  };

  const filteredBrands = getFilteredBrands();
  const indexOfLastBrand = currentPage * brandsPerPage;
  const indexOfFirstBrand = indexOfLastBrand - brandsPerPage;
  const currentBrands = filteredBrands.slice(
    indexOfFirstBrand,
    indexOfLastBrand
  );
  const totalPages = Math.ceil(filteredBrands.length / brandsPerPage);

  const handleDelete = (brand: Brand) => {
    setBrandToDelete(brand);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (brandToDelete) {
      setBrands(brands.filter((brand) => brand.id !== brandToDelete.id));
      showAlert('success', 'Brand Deleted', 'Brand was successfully deleted.');
      setIsDeleteModalOpen(false);
      setBrandToDelete(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddBrand = () => {
    setIsEditing(false);
    setBrandToEdit(null);
    setTempImages([]);
    setIsModalOpen(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setIsEditing(true);
    setBrandToEdit(brand);
    setTempImages(brand.images || []);
    setIsModalOpen(true);
  };

  const handleSaveBrand = (brandName: string) => {
    try {
      if (!brandName.trim()) {
        showAlert('error', 'Invalid Input', 'Brand name cannot be empty.');
        return;
      }

      if (isEditing && brandToEdit) {
        setBrands(
          brands.map((b) =>
            b.id === brandToEdit.id
              ? { ...b, name: brandName.toUpperCase(), images: tempImages }
              : b
          )
        );
        setIsModalOpen(false);
        setIsEditing(false);
        setBrandToEdit(null);
        setTempImages([]);
        showAlert('success', 'Brand Updated', 'Brand updated successfully!');
      } else {
        const existingBrand = brands.find(
          (b) => b.name.toLowerCase() === brandName.toLowerCase()
        );
        if (existingBrand) {
          showAlert('error', 'Duplicate Brand', 'This brand already exists.');
          return;
        }

        setBrands([
          ...brands,
          {
            id: Date.now(),
            name: brandName.toUpperCase(),
            images: tempImages, // Lưu ảnh khi thêm mới
            createdAt: new Date().toISOString(),
          },
        ]);
        setIsModalOpen(false);
        setIsEditing(false);
        setBrandToEdit(null);
        setTempImages([]);
        showAlert('success', 'Brand Added', 'Brand added successfully!');
      }
    } catch (error: any) {
      console.error('Error saving brand:', error);
      showAlert(
        'error',
        'Error',
        error.message || 'An error occurred while saving the brand.'
      );
    }
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  return (
    <>
      <PageMeta
        title="Brand Management | TailAdmin - React.js Admin Dashboard Template"
        description="Manage brands in TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="p-4 sm:p-6 md:p-8 bg-[#F1F9FB] dark:bg-gray-800 min-h-screen transition-colors duration-300 relative">
        <Toast ref={toast} />

        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Brand Management
        </h1>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name..."
            className="h-12 rounded-xl border border-gray-200 bg-[#E6F2F5] px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A8DCE7] transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
          <button
            onClick={handleAddBrand}
            className="h-12 rounded-xl bg-[#A8DCE7] px-6 py-3 text-sm font-medium text-gray-800 hover:bg-[#95C8D2] focus:ring-2 focus:ring-[#A8DCE7] focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <i className="pi pi-plus"></i> Add Brand
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
        <div className="overflow-x-auto rounded-xl shadow-sm">
          <table className="min-w-full bg-white dark:bg-gray-900 rounded-xl">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Brand Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentBrands.map((brand) => (
                <tr
                  key={brand.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
                >
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    {brand.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(brand.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditBrand(brand)}
                      className="text-[#A8DCE7] hover:text-[#95C8D2] mr-4"
                    >
                      <i className="pi pi-pencil"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(brand)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <i className="pi pi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="flex flex-wrap justify-center gap-2 mt-6"
        />
      </div>

      {/* Modal Add/Edit Brand */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg max-w-md w-full p-6 sm:p-8 transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                {isEditing ? 'Edit Brand' : 'Add New Brand'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200 transition-colors duration-300"
              >
                <i className="pi pi-times"></i>
              </button>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                <i className="pi pi-filter"></i> Brand Name *
              </label>
              <input
                type="text"
                value={brandToEdit?.name || ''}
                onChange={(e) =>
                  setBrandToEdit({ ...brandToEdit!, name: e.target.value })
                }
                className="h-12 w-full rounded-xl border border-gray-200 bg-[#E6F2F5] px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A8DCE7] transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                placeholder="Enter brand name"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                <i className="pi pi-image"></i> Brand Images (Max 4)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="h-12 w-full rounded-xl border border-gray-200 bg-[#E6F2F5] px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A8DCE7] transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
              {tempImages.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-4">
                  {tempImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="h-16 w-16 rounded-lg object-cover shadow-sm"
                      />
                      <button
                        onClick={() =>
                          setTempImages(
                            tempImages.filter((_, i) => i !== index)
                          )
                        }
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs"
                      >
                        <i className="pi pi-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleSaveBrand(brandToEdit?.name || '')}
                className="h-12 rounded-xl bg-[#A8DCE7] px-6 py-3 text-sm font-medium text-gray-800 hover:bg-[#95C8D2] focus:ring-2 focus:ring-[#A8DCE7] focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 justify-center"
              >
                <i className="pi pi-sync"></i>{' '}
                {isEditing ? 'Update Brand' : 'Save Brand'}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="h-12 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 justify-center"
              >
                <i className="pi pi-times"></i> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg max-w-sm w-full p-6 transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Confirm Delete
              </h3>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200 transition-colors duration-300"
              >
                <i className="pi pi-times"></i>
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete the brand "{brandToDelete?.name}"?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="h-10 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="h-10 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-all duration-300"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BrandManagement;
