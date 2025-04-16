import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify'; // Import react-toastify
import { Product, Size } from '../../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  brandSuggestions: string[];
  productToEdit?: Product | null;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  brandSuggestions,
  productToEdit,
}) => {
  const [mainImage, setMainImage] = useState<string | null>(productToEdit?.mainImage || null);
  const [subImages, setSubImages] = useState<string[]>(productToEdit?.subImages || []);
  const [name, setName] = useState(productToEdit?.name || '');
  const [color, setColor] = useState(productToEdit?.color || '');
  const [sizes, setSizes] = useState<Size[]>(productToEdit?.sizes || [{ size: '', quantity: 0 }]);
  const [brand, setBrand] = useState(productToEdit?.brand || '');
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [price, setPrice] = useState(productToEdit?.price || '');
  const [status, setStatus] = useState<'Deleted=0' | 'Released' | 'Unreleased'>(
    productToEdit?.status || 'Released'
  );

  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const subImageInputRef = useRef<HTMLInputElement>(null);

  const colors = [
    { name: 'Red', code: '#FF0000' },
    { name: 'Blue', code: '#0000FF' },
    { name: 'Green', code: '#008000' },
    { name: 'Black', code: '#000000' },
    { name: 'White', code: '#FFFFFF' },
  ];

  useEffect(() => {
    if (productToEdit) {
      setMainImage(productToEdit.mainImage);
      setSubImages(productToEdit.subImages);
      setName(productToEdit.name);
      setColor(productToEdit.color);
      setSizes(productToEdit.sizes.length > 0 ? productToEdit.sizes : [{ size: '', quantity: 0 }]);
      setBrand(productToEdit.brand);
      setDescription(productToEdit.description);
      setPrice(productToEdit.price);
      setStatus(productToEdit.status);
    }
  }, [productToEdit]);

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImage(reader.result as string);
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
    setMainImage(null);
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = '';
    }
  };

  const handleSubImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSubImages([...subImages, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteSubImage = (index: number) => {
    setSubImages(subImages.filter((_, i) => i !== index));
  };

  const handleAddSize = () => {
    setSizes([...sizes, { size: '', quantity: 0 }]);
  };

  const handleSizeChange = (index: number, field: 'size' | 'quantity', value: string | number) => {
    const newSizes = [...sizes];
    if (field === 'size') {
      const numericValue = value.toString().replace(/[^0-9]/g, '');
      newSizes[index] = { ...newSizes[index], [field]: numericValue };
    } else {
      newSizes[index] = { ...newSizes[index], [field]: value as number };
    }
    setSizes(newSizes);
  };

  const handleDeleteSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setBrand(value);
  };

  const handleColorSelect = (colorName: string) => {
    setColor(colorName);
  };

  const validateForm = () => {
    let errorMessage = '';

    if (!mainImage) {
      errorMessage = 'Main image is required.';
    } else if (!name.trim()) {
      errorMessage = 'Shoe name is required.';
    } else if (!color) {
      errorMessage = 'Please select a color.';
    } else if (sizes.some((s) => !s.size || parseInt(s.size) <= 0 || s.quantity <= 0)) {
      errorMessage = 'Each size must be a number greater than 0 and have a quantity greater than 0.';
    } else if (!brand.trim()) {
      errorMessage = 'Brand name is required.';
    } else if (!description.trim()) {
      errorMessage = 'Description is required.';
    } else if (!price.trim() || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      errorMessage = 'Price must be a valid number greater than 0.';
    }

    if (errorMessage) {
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalSizes = sizes.map((size) => ({
      ...size,
      quantity: size.quantity === ('' as any) ? 0 : size.quantity,
    }));
    setSizes(finalSizes);

    if (!validateForm()) {
      return;
    }

    const product: Product = {
      id: productToEdit?.id ?? Date.now(),
      name,
      sku: productToEdit?.sku ?? `TI${Math.floor(Math.random() * 10000)}`,
      mainImage: mainImage!,
      subImages,
      color,
      sizes: finalSizes,
      brand,
      description,
      price: price.replace(/[^0-9]/g, ''),
      purchaseUnit: productToEdit?.purchaseUnit ?? 0,
      stock: finalSizes.reduce((total, s) => total + s.quantity, 0),
      status,
      createdAt: productToEdit?.createdAt ?? new Date().toISOString(),
    };

    onSave(product);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setMainImage(null);
    setSubImages([]);
    setName('');
    setColor('');
    setSizes([{ size: '', quantity: 0 }]);
    setBrand('');
    setDescription('');
    setPrice('');
    setStatus('Released');
  };

  const formatPriceInput = (value: string) => {
    const numValue = value.replace(/[^0-9]/g, '');
    return numValue;
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-2xl w-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
          {productToEdit ? 'Edit Product' : 'Add New Product'}
        </h2>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <i className="pi pi-times text-xl" />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {/* Main Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            <i className="pi pi-image mr-2" /> Main Image *
          </label>
          <div className="flex items-center gap-3">
            {mainImage ? (
              <div className="relative">
                <img
                  src={mainImage}
                  alt="Main"
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

        {/* Sub Images */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            <i className="pi pi-images mr-2" /> Sub Images
          </label>
          <div className="flex items-center gap-3 flex-wrap">
            {subImages.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img}
                  alt={`Sub ${index}`}
                  className="h-16 w-16 rounded-lg object-cover shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteSubImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center"
                >
                  <i className="pi pi-times text-xs" />
                </button>
              </div>
            ))}
            <div
              onClick={() => subImageInputRef.current?.click()}
              className="h-16 w-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer"
            >
              <i className="pi pi-plus text-gray-400" />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={subImageInputRef}
              onChange={handleSubImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            <i className="pi pi-tag mr-2" /> Shoe Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-all duration-200"
            placeholder="Enter shoe name"
          />
        </div>

        {/* Color - Chọn bằng ô màu */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            <i className="pi pi-palette mr-2" /> Color *
          </label>
          <div className="flex gap-2">
            {colors.map((c) => (
              <div
                key={c.name}
                onClick={() => handleColorSelect(c.name)}
                className={`h-8 w-8 rounded-full cursor-pointer border-2 ${
                  color === c.name ? 'border-blue-500' : 'border-gray-300'
                }`}
                style={{ backgroundColor: c.code }}
                title={c.name}
              />
            ))}
          </div>
          {color && (
            <div className="mt-2 text-sm text-gray-700 dark:text-gray-400">
              Selected color: {color}
            </div>
          )}
        </div>

        {/* Sizes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            <i className="pi pi-list mr-2" /> Sizes *
          </label>
          {sizes.map((size, index) => (
            <div key={index} className="flex items-center gap-3 mb-2">
              <input
                type="text"
                value={size.size}
                onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                placeholder="Size (e.g., 38)"
                className="h-12 w-1/2 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-all duration-200"
              />
              <input
                type="number"
                value={size.quantity}
                onChange={(e) => handleSizeChange(index, 'quantity', parseInt(e.target.value) || 0)}
                placeholder="Quantity"
                className="h-12 w-1/2 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => handleDeleteSize(index)}
                className="text-red-500 hover:text-red-700"
              >
                <i className="pi pi-trash" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSize}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
          >
            <i className="pi pi-plus mr-2" /> Add Size
          </button>
        </div>

        {/* Brand */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            <i className="pi pi-building mr-2" /> Brand *
          </label>
          <input
            type="text"
            value={brand}
            onChange={handleBrandChange}
            list="brandSuggestions"
            className="h-12 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-all duration-200"
            placeholder="Enter brand name"
          />
          <datalist id="brandSuggestions">
            {brandSuggestions.map((suggestion, index) => (
              <option key={index} value={suggestion} />
            ))}
          </datalist>
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

        {/* Price */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            <i className="pi pi-dollar mr-2" /> Price (VND) *
          </label>
          <input
            type="text"
            value={price ? parseFloat(price).toLocaleString('vi-VN') : ''}
            onChange={(e) => {
              const formattedValue = formatPriceInput(e.target.value);
              setPrice(formattedValue);
            }}
            className="h-12 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-all duration-200"
            placeholder="Enter price (e.g., 99.000)"
          />
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            <i className="pi pi-info-circle mr-2" /> Status *
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'Deleted=0' | 'Released' | 'Unreleased')}
            className="h-12 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-all duration-200"
          >
            <option value="Deleted=0">Deleted</option>
            <option value="Released">Released</option>
            <option value="Unreleased">Unreleased</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="h-12 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-md hover:bg-blue-700 transition-all duration-200"
          >
            <i className="pi pi-check mr-2" /> {productToEdit ? 'Update Product' : 'Save Product'}
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

export default ProductFormModal;