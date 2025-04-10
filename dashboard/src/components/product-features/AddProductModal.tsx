import React, { useState, useEffect, useRef } from 'react';

interface Size {
  size: string;
  quantity: number;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  mainImage: string;
  subImages: string[];
  color: string;
  sizes: Size[];
  brand: string;
  description: string;
  price: string;
  purchaseUnit: number;
  stock: number;
  status: 'Active' | 'Inactive';
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
  brandSuggestions: string[];
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAddProduct, brandSuggestions }) => {
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [subImages, setSubImages] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [sizes, setSizes] = useState<Size[]>([{ size: '', quantity: 0 }]);
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const [errors, setErrors] = useState({
    mainImage: '',
    name: '',
    color: '',
    sizes: '',
    brand: '',
    description: '',
    price: '',
  });

  // Ref cho input file
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const subImageInputRef = useRef<HTMLInputElement>(null);

  // Xử lý upload ảnh chính
  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImage(reader.result as string);
        setErrors((prev) => ({ ...prev, mainImage: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý chỉnh sửa ảnh chính
  const handleEditMainImage = () => {
    if (mainImageInputRef.current) {
      mainImageInputRef.current.click();
    }
  };

  const handleDeleteMainImage = () => {
    setMainImage(null);
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = ''; // Reset input file
    }
  };

  // Xử lý upload ảnh phụ
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

  // Xử lý thêm size
  const handleAddSize = () => {
    setSizes([...sizes, { size: '', quantity: 0 }]);
  };

  // Xử lý cập nhật size
  const handleSizeChange = (index: number, field: 'size' | 'quantity', value: string | number) => {
    const newSizes = [...sizes];
    if (field === 'size') {
      const numericValue = value.toString().replace(/[^0-9]/g, '');
      newSizes[index] = { ...newSizes[index], [field]: numericValue };
    } else {
      newSizes[index] = { ...newSizes[index], [field]: value as number };
    }
    setSizes(newSizes);
    setErrors((prev) => ({ ...prev, sizes: '' }));
  };

  // Xử lý xóa size
  const handleDeleteSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  // Xử lý gợi ý hãng
  const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setBrand(value);
    setErrors((prev) => ({ ...prev, brand: '' }));
  };

  // Validation form
  const validateForm = () => {
    const newErrors = {
      mainImage: '',
      name: '',
      color: '',
      sizes: '',
      brand: '',
      description: '',
      price: '',
    };
    let isValid = true;

    if (!mainImage) {
      newErrors.mainImage = 'Main image is required.';
      isValid = false;
    }
    if (!name.trim()) {
      newErrors.name = 'Shoe name is required.';
      isValid = false;
    }
    if (!color) {
      newErrors.color = 'Please select a color.';
      isValid = false;
    }
    if (sizes.some((s) => !s.size || parseInt(s.size) <= 0 || s.quantity <= 0)) {
      newErrors.sizes = 'Each size must be a number greater than 0 and have a quantity greater than 0.';
      isValid = false;
    }
    if (!brand.trim()) {
      newErrors.brand = 'Brand name is required.';
      isValid = false;
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required.';
      isValid = false;
    }
    if (!price.trim() || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      newErrors.price = 'Price must be a valid number greater than 0.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Xử lý submit form
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

    const newProduct: Product = {
      id: Date.now(),
      name,
      sku: `TI${Math.floor(Math.random() * 10000)}`,
      mainImage: mainImage!,
      subImages,
      color,
      sizes: finalSizes,
      brand,
      description,
      price,
      purchaseUnit: 0,
      stock: finalSizes.reduce((total, s) => total + s.quantity, 0),
      status: 'Active',
    };

    onAddProduct(newProduct);
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
    setErrors({
      mainImage: '',
      name: '',
      color: '',
      sizes: '',
      brand: '',
      description: '',
      price: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-2xl w-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
          Add New Product
        </h2>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <i className="pi pi-times text-xl" />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            <i className="pi pi-image mr-2" /> Main Image *
          </label>
          {!mainImage ? (
            <button
              type="button"
              onClick={() => mainImageInputRef.current?.click()}
              className="h-32 w-32 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
            >
              <i className="pi pi-plus text-4xl text-gray-500 dark:text-gray-400" />
            </button>
          ) : (
            <div className="relative">
              <img src={mainImage} alt="Main Preview" className="h-32 w-32 rounded-lg object-cover shadow-sm" />
              <div className="absolute bottom-2 right-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleEditMainImage}
                  className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary/90"
                >
                  <i className="pi pi-pencil text-sm" />
                </button>
                <button
                  type="button"
                  onClick={handleDeleteMainImage}
                  className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600"
                >
                  <i className="pi pi-trash text-sm" />
                </button>
              </div>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={mainImageInputRef}
            onChange={handleMainImageUpload}
            className="hidden"
          />
          {errors.mainImage && (
            <p className="text-red-500 text-xs mt-1">{errors.mainImage}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            <i className="pi pi-images mr-2" /> Sub Images
          </label>
          <button
            type="button"
            onClick={() => subImageInputRef.current?.click()}
            className="h-20 w-20 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
          >
            <i className="pi pi-plus text-3xl text-gray-500 dark:text-gray-400" />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={subImageInputRef}
            onChange={handleSubImageUpload}
            className="hidden"
          />
          {subImages.length > 0 && (
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {subImages.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    alt={`Sub Image ${index + 1}`}
                    className="h-20 w-20 rounded-lg object-cover shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteSubImage(index)}
                    className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600"
                  >
                    <i className="pi pi-times text-xs" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            <i className="pi pi-tag mr-2" /> Shoe Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: '' }));
            }}
            className="h-12 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-all duration-200"
            placeholder="Enter shoe name"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            <i className="pi pi-palette mr-2" /> Color *
          </label>
          <select
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              setErrors((prev) => ({ ...prev, color: '' }));
            }}
            className="h-12 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:focus:ring-primary/30 transition-all duration-200"
          >
            <option value="">Select a color</option>
            <option value="Blue">Blue</option>
            <option value="Red">Red</option>
            <option value="Purple">Purple</option>
            <option value="Yellow">Yellow</option>
            <option value="Black">Black</option>
            <option value="White">White</option>
          </select>
          {errors.color && (
            <p className="text-red-500 text-xs mt-1">{errors.color}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            <i className="pi pi-arrows-h mr-2" /> Sizes and Quantities *
          </label>
          {sizes.map((size, index) => (
            <div key={index} className="flex gap-3 mb-3 items-center">
              <input
                type="text"
                value={size.size}
                onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                placeholder="Size (e.g., 38, 39)"
                className="h-12 w-1/3 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-all duration-200"
              />
              <input
                type="number"
                value={size.quantity === 0 ? '' : size.quantity}
                onInput={(e) => {
                  const value = (e.target as HTMLInputElement).value;
                  const numericValue = value === '' ? '' : parseInt(value.replace(/[^0-9]/g, '')) || 0;
                  handleSizeChange(index, 'quantity', numericValue);
                }}
                placeholder="Quantity"
                className="h-12 w-1/3 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => handleDeleteSize(index)}
                className="h-12 w-12 rounded-lg bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-all duration-200 shadow-sm"
              >
                <i className="pi pi-trash" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSize}
            className="h-12 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <i className="pi pi-plus mr-2" /> Add Size
          </button>
          {errors.sizes && (
            <p className="text-red-500 text-xs mt-1">{errors.sizes}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            <i className="pi pi-building mr-2" /> Brand *
          </label>
          <input
            type="text"
            value={brand}
            onChange={handleBrandChange}
            list="brandSuggestions"
            className="h-12 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-all duration-200"
            placeholder="Enter brand name"
          />
          <datalist id="brandSuggestions">
            {brandSuggestions.map((b, index) => (
              <option key={index} value={b} />
            ))}
          </datalist>
          {errors.brand && (
            <p className="text-red-500 text-xs mt-1">{errors.brand}</p>
          )}
        </div>

        {/* Mô tả */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            <i className="pi pi-file mr-2" /> Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors((prev) => ({ ...prev, description: '' }));
            }}
            className="h-32 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-all duration-200"
            placeholder="Enter description"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        {/* Giá */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            <i className="pi pi-dollar mr-2" /> Price *
          </label>
          <input
            type="text"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              setErrors((prev) => ({ ...prev, price: '' }));
            }}
            className="h-12 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-all duration-200"
            placeholder="Enter price (e.g., $99.99)"
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="h-12 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white shadow-md hover:bg-primary/90 transition-all duration-200"
          >
            <i className="pi pi-check mr-2" /> Save Product
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

export default AddProductModal;