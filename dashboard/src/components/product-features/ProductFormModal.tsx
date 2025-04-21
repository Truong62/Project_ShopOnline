import React, { useState, useEffect, useRef } from 'react';
import { Product, Size, Variant } from '../../types';
import Alert from '../../components/ui/alert/Alert';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  brandSuggestions: string[];
  productToEdit?: Product | null;
  colors: { name: string; code?: string }[];
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  brandSuggestions,
  productToEdit,
  colors: initialColors,
}) => {
  const [name, setName] = useState(productToEdit?.name || '');
  const [description, setDescription] = useState(
    productToEdit?.description || ''
  );
  const [brand, setBrand] = useState(productToEdit?.brand || '');
  const [status] = useState<'Deleted=0' | 'Released' | 'Unreleased'>(
    'Unreleased'
  );
  const [showVariants, setShowVariants] = useState(false);
  const [variants, setVariants] = useState<Variant[]>(
    productToEdit?.variants && productToEdit.variants.length > 0
      ? productToEdit.variants
      : productToEdit?.color
        ? [
            {
              color: productToEdit.color,
              mainImage: productToEdit.mainImage || null,
              subImages: productToEdit.subImages || [],
              sizes: productToEdit.sizes || [{ size: '', quantity: 0 }],
              price: productToEdit.price || '',
            },
          ]
        : []
  );
  const [mainImageFiles, setMainImageFiles] = useState<(File | null)[]>([]);
  const [subImageFiles, setSubImageFiles] = useState<File[][]>([]);
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [colors, setColors] = useState(initialColors);
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState<number | null>(
    null
  );
  const [newColor, setNewColor] = useState('');
  const [isAddingColor, setIsAddingColor] = useState<number | null>(null);

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

  const mainImageInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const subImageInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setDescription(productToEdit.description);
      setBrand(productToEdit.brand);
      if (productToEdit.variants && productToEdit.variants.length > 0) {
        setShowVariants(true);
        setVariants(productToEdit.variants);
        setMainImageFiles(productToEdit.variants.map(() => null));
        setSubImageFiles(productToEdit.variants.map(() => []));
      } else if (productToEdit.color) {
        setShowVariants(true);
        setVariants([
          {
            color: productToEdit.color,
            mainImage: productToEdit.mainImage || null,
            subImages: productToEdit.subImages || [],
            sizes: productToEdit.sizes || [{ size: '', quantity: 0 }],
            price: productToEdit.price || '',
          },
        ]);
        setMainImageFiles([null]);
        setSubImageFiles([[]]);
      } else {
        setShowVariants(false);
        setVariants([]);
        setMainImageFiles([]);
        setSubImageFiles([]);
      }
    }
  }, [productToEdit]);

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

  const handleAddVariant = () => {
    setShowVariants(true);
    setVariants([
      ...variants,
      {
        color: '',
        mainImage: null,
        subImages: [],
        sizes: [{ size: '', quantity: 0 }],
        price: '',
      },
    ]);
    setMainImageFiles([...mainImageFiles, null]);
    setSubImageFiles([...subImageFiles, []]);
  };

  const handleRemoveVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
    setMainImageFiles(mainImageFiles.filter((_, i) => i !== index));
    setSubImageFiles(subImageFiles.filter((_, i) => i !== index));
    if (newVariants.length === 0) {
      setShowVariants(false);
    }
  };

  const handleMainImageUpload =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const newVariants = [...variants];
        const newMainImageFiles = [...mainImageFiles];
        newMainImageFiles[index] = file;
        setMainImageFiles(newMainImageFiles);
        newVariants[index].mainImage = URL.createObjectURL(file);
        setVariants(newVariants);
      }
    };

  const handleEditMainImage = (index: number) => {
    if (mainImageInputRefs.current[index]) {
      mainImageInputRefs.current[index]!.click();
    }
  };

  const handleDeleteMainImage = (index: number) => {
    const newVariants = [...variants];
    const newMainImageFiles = [...mainImageFiles];
    newVariants[index].mainImage = null;
    newMainImageFiles[index] = null;
    setVariants(newVariants);
    setMainImageFiles(newMainImageFiles);
    if (mainImageInputRefs.current[index]) {
      mainImageInputRefs.current[index]!.value = '';
    }
  };

  const handleSubImageUpload =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        const newVariants = [...variants];
        const newSubImageFiles = [...subImageFiles];
        const subFiles = Array.from(files);
        newSubImageFiles[index] = [...newSubImageFiles[index], ...subFiles];
        newVariants[index].subImages = [
          ...newVariants[index].subImages,
          ...subFiles.map((file) => URL.createObjectURL(file)),
        ];
        setVariants(newVariants);
        setSubImageFiles(newSubImageFiles);
      }
    };

  const handleDeleteSubImage = (
    variantIndex: number,
    subImageIndex: number
  ) => {
    const newVariants = [...variants];
    const newSubImageFiles = [...subImageFiles];
    newVariants[variantIndex].subImages = newVariants[
      variantIndex
    ].subImages.filter((_, i) => i !== subImageIndex);
    newSubImageFiles[variantIndex] = newSubImageFiles[variantIndex].filter(
      (_, i) => i !== subImageIndex
    );
    setVariants(newVariants);
    setSubImageFiles(newSubImageFiles);
  };

  const handleAddSize = (index: number) => {
    const newVariants = [...variants];
    newVariants[index].sizes = [
      ...newVariants[index].sizes,
      { size: '', quantity: 0 },
    ];
    setVariants(newVariants);
  };

  const handleSizeChange = (
    variantIndex: number,
    sizeIndex: number,
    field: 'size' | 'quantity',
    value: string | number
  ) => {
    const newVariants = [...variants];
    if (field === 'size') {
      const numericValue = value.toString().replace(/[^0-9]/g, '');
      newVariants[variantIndex].sizes[sizeIndex] = {
        ...newVariants[variantIndex].sizes[sizeIndex],
        [field]: numericValue,
      };
    } else {
      newVariants[variantIndex].sizes[sizeIndex] = {
        ...newVariants[variantIndex].sizes[sizeIndex],
        [field]: value as number,
      };
    }
    setVariants(newVariants);
  };

  const handleDeleteSize = (variantIndex: number, sizeIndex: number) => {
    const newVariants = [...variants];
    newVariants[variantIndex].sizes = newVariants[variantIndex].sizes.filter(
      (_, i) => i !== sizeIndex
    );
    setVariants(newVariants);
  };

  const getAvailableColors = (currentIndex: number) => {
    const usedColors = variants
      .filter((_, i) => i !== currentIndex)
      .map((v) => v.color)
      .filter((color) => color !== '');
    return colors.filter((color) => !usedColors.includes(color.name));
  };

  const handleColorSelect = (index: number, colorName: string) => {
    const newVariants = [...variants];
    newVariants[index].color = colorName;
    setVariants(newVariants);
    setIsColorDropdownOpen(null);
  };

  const handleAddColor = (index: number) => {
    if (
      newColor.trim() &&
      !colors.some((c) => c.name.toLowerCase() === newColor.toLowerCase())
    ) {
      setColors([...colors, { name: newColor }]);
      const newVariants = [...variants];
      newVariants[index].color = newColor;
      setVariants(newVariants);
    }
    setNewColor('');
    setIsAddingColor(null);
  };

  const handleBrandSelect = (brandName: string) => {
    setBrand(brandName);
    setIsBrandDropdownOpen(false);
  };

  const formatPriceInput = (value: string) => {
    const numValue = value.replace(/[^0-9]/g, '');
    return numValue;
  };

  const handlePriceChange = (index: number, value: string) => {
    const newVariants = [...variants];
    newVariants[index].price = formatPriceInput(value);
    setVariants(newVariants);
  };

  const validateForm = () => {
    let errorMessage = '';

    if (!name.trim()) {
      errorMessage = 'Shoe name is required.';
    } else if (!description.trim()) {
      errorMessage = 'Description is required.';
    } else if (!brand) {
      errorMessage = 'Please select a brand.';
    }

    if (showVariants) {
      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];
        if (!variant.color) {
          errorMessage = `Please select a color for variant ${i + 1}.`;
        } else if (!variant.mainImage) {
          errorMessage = `Main image is required for variant ${i + 1}.`;
        } else if (
          variant.sizes.some(
            (s) => !s.size || parseInt(s.size) <= 0 || s.quantity <= 0
          )
        ) {
          errorMessage = `Each size in variant ${i + 1} must be a number greater than 0 and have a quantity greater than 0.`;
        } else if (
          !variant.price.trim() ||
          isNaN(parseFloat(variant.price)) ||
          parseFloat(variant.price) <= 0
        ) {
          errorMessage = `Price in variant ${i + 1} must be a valid number greater than 0.`;
        }
        if (errorMessage) break;
      }

      // Kiểm tra màu trùng lặp
      const colorsUsed = variants
        .map((v) => v.color)
        .filter((color) => color !== '');
      const uniqueColors = new Set(colorsUsed);
      if (colorsUsed.length !== uniqueColors.size) {
        errorMessage = 'Each variant must have a unique color.';
      }
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

    const sanitizedVariants = variants.map((variant, index) => ({
      ...variant,
      mainImage: mainImageFiles[index]
        ? `file://${mainImageFiles[index]!.name}`
        : null,
      subImages: subImageFiles[index].map((file) => `file://${file.name}`),
    }));

    if (!showVariants || variants.length === 0) {
      const product: Product = {
        id: productToEdit?.id ?? Date.now(),
        name,
        sku: productToEdit?.sku ?? `TI${Math.floor(Math.random() * 10000)}`,
        brand,
        description,
        purchaseUnit: productToEdit?.purchaseUnit ?? 0,
        status,
        createdAt: productToEdit?.createdAt ?? new Date().toISOString(),
      };

      onSave(product);
      showAlert(
        'success',
        'Success',
        productToEdit
          ? 'Product updated successfully!'
          : 'Product added successfully!'
      );
      handleClose();
      return;
    }

    const firstVariant = sanitizedVariants[0];
    const product: Product = {
      id: productToEdit?.id ?? Date.now(),
      name,
      sku: productToEdit?.sku ?? `TI${Math.floor(Math.random() * 10000)}`,
      mainImage: firstVariant.mainImage ?? undefined,
      subImages: firstVariant.subImages,
      color: firstVariant.color,
      sizes: firstVariant.sizes,
      brand,
      description,
      price: firstVariant.price,
      purchaseUnit: productToEdit?.purchaseUnit ?? 0,
      stock: firstVariant.sizes.reduce((total, s) => total + s.quantity, 0),
      status,
      createdAt: productToEdit?.createdAt ?? new Date().toISOString(),
      variants: sanitizedVariants,
    };

    onSave(product);
    showAlert(
      'success',
      'Success',
      productToEdit
        ? 'Product updated successfully!'
        : 'Product added successfully!'
    );
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setName('');
    setDescription('');
    setBrand('');
    setShowVariants(false);
    setVariants([]);
    setMainImageFiles([]);
    setSubImageFiles([]);
    setIsBrandDropdownOpen(false);
    setIsColorDropdownOpen(null);
    setNewColor('');
    setIsAddingColor(null);
    setAlert({ show: false, variant: 'error', title: '', message: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg max-w-3xl w-full p-6 sm:p-8 transition-colors duration-300 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
          {productToEdit ? 'Edit Product' : 'Add New Product'}
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
            <i className="pi pi-tag"></i> Shoe Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 w-full rounded-xl border border-gray-200 bg-[#E6F2F5] px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A8DCE7] transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="Enter shoe name"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            <i className="pi pi-clipboard"></i> Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-28 w-full rounded-xl border border-gray-200 bg-[#E6F2F5] px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A8DCE7] transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="Enter description"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            <i className="pi pi-filter"></i> Brand *
          </label>
          <div className="relative">
            <div
              onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
              className="h-12 w-full rounded-xl border border-gray-200 bg-[#E6F2F5] px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A8DCE7] transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 cursor-pointer flex justify-between items-center"
            >
              <span>{brand || 'Select a brand'}</span>
              <i
                className={`pi pi-chevron-${isBrandDropdownOpen ? 'up' : 'down'}`}
              ></i>
            </div>
            {isBrandDropdownOpen && (
              <div className="absolute w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-[190px] overflow-y-auto z-10">
                {brandSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleBrandSelect(suggestion)}
                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {!showVariants && (
          <div className="mb-6">
            <button
              type="button"
              onClick={handleAddVariant}
              className="text-[#A8DCE7] hover:text-[#95C8D2] text-sm flex items-center gap-2 transition-colors duration-300"
            >
              <i className="pi pi-plus"></i> Add Variants
            </button>
          </div>
        )}

        {showVariants &&
          variants.map((variant, index) => (
            <div
              key={index}
              className="mb-6 border border-gray-200 dark:border-gray-700 rounded-xl p-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Variant {index + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(index)}
                  className="text-red-500 hover:text-red-600 transform hover:scale-110 transition-all duration-300"
                >
                  <i className="pi pi-times text-red-500"></i>
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  <i className="pi pi-palette"></i> Color *
                </label>
                {getAvailableColors(index).length === 0 && !variant.color ? (
                  <div className="text-gray-500 dark:text-gray-400">
                    No available colors. Please add a new color.
                  </div>
                ) : (
                  <div className="relative flex items-center gap-3">
                    <div className="flex-1">
                      <div
                        onClick={() =>
                          setIsColorDropdownOpen(
                            isColorDropdownOpen === index ? null : index
                          )
                        }
                        className="h-12 w-full rounded-xl border border-gray-200 bg-[#E6F2F5] px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A8DCE7] transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 cursor-pointer flex justify-between items-center"
                      >
                        <span>{variant.color || 'Select a color'}</span>
                        <i
                          className={`pi pi-chevron-${isColorDropdownOpen === index ? 'up' : 'down'}`}
                        ></i>
                      </div>
                      {isColorDropdownOpen === index && (
                        <div className="absolute w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-[190px] overflow-y-auto z-10">
                          {getAvailableColors(index).map((c, i) => (
                            <div
                              key={i}
                              onClick={() => handleColorSelect(index, c.name)}
                              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            >
                              {c.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setIsAddingColor(isAddingColor === index ? null : index)
                      }
                      className="text-[#A8DCE7] hover:text-[#95C8D2] text-sm flex items-center gap-2 transition-colors duration-300"
                    >
                      <i className="pi pi-plus"></i> Add Color
                    </button>
                  </div>
                )}
                {isAddingColor === index && (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-[#E6F2F5] px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A8DCE7] transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      placeholder="Enter new color"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddColor(index)}
                      className="h-12 rounded-xl bg-[#A8DCE7] px-4 py-3 text-sm font-medium text-gray-800 hover:bg-[#95C8D2] transition-all duration-300"
                    >
                      Add
                    </button>
                  </div>
                )}
                {variant.color && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Selected color: {variant.color}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  <i className="pi pi-image"></i> Main Image *
                </label>
                <div className="flex items-center gap-3">
                  {variant.mainImage ? (
                    <div className="flex items-center gap-3">
                      <div className="relative inline-block">
                        <img
                          src={variant.mainImage}
                          alt="Main"
                          className="h-24 w-24 rounded-xl object-cover shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteMainImage(index)}
                          className="absolute top-0 right-0 bg-white rounded-md p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        >
                          <i className="pi pi-times text-red-500"></i>
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleEditMainImage(index)}
                        className="ml-2 bg-[#A8DCE7] text-gray-800 rounded-full h-6 px-2 text-sm flex items-center justify-center transform hover:scale-110 transition-all duration-300"
                      >
                        Edit
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => mainImageInputRefs.current[index]?.click()}
                      className="pi pi-plus h-24 w-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#A8DCE7] transition-colors duration-300"
                    ></div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => {
                      mainImageInputRefs.current[index] = el;
                    }}
                    onChange={handleMainImageUpload(index)}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  <i className="pi pi-images"></i> Sub Images
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  {variant.subImages.map((img, subIndex) => (
                    <div key={subIndex} className="relative">
                      <img
                        src={img}
                        alt={`Sub ${subIndex}`}
                        className="h-16 w-16 rounded-xl object-cover shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteSubImage(index, subIndex)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center transform hover:scale-110 transition-all duration-300"
                      >
                        <i className="pi pi-times"></i>
                      </button>
                    </div>
                  ))}
                  <div
                    onClick={() => subImageInputRefs.current[index]?.click()}
                    className="h-16 w-16 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#A8DCE7] transition-colors duration-300"
                  >
                    <i className="pi pi-plus"></i>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={(el) => {
                      subImageInputRefs.current[index] = el;
                    }}
                    onChange={handleSubImageUpload(index)}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  <i className="pi pi-list"></i> Sizes *
                </label>
                {variant.sizes.map((size, sizeIndex) => (
                  <div key={sizeIndex} className="flex items-center gap-3 mb-3">
                    <input
                      type="text"
                      value={size.size}
                      onChange={(e) =>
                        handleSizeChange(
                          index,
                          sizeIndex,
                          'size',
                          e.target.value
                        )
                      }
                      placeholder="Size (e.g., 38)"
                      className="h-12 w-1/2 rounded-xl border border-gray-200 bg-[#E6F2F5] px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A8DCE7] transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    />
                    <input
                      type="number"
                      value={size.quantity}
                      onChange={(e) =>
                        handleSizeChange(
                          index,
                          sizeIndex,
                          'quantity',
                          parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="Quantity"
                      className="h-12 w-1/2 rounded-xl border border-gray-200 bg-[#E6F2F5] px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A8DCE7] transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteSize(index, sizeIndex)}
                      className="text-red-500 hover:text-red-600 transform hover:scale-110 transition-all duration-300"
                    >
                      <i className="pi pi-times text-red-500"></i>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddSize(index)}
                  className="text-[#A8DCE7] hover:text-[#95C8D2] text-sm flex items-center gap-2 transition-colors duration-300"
                >
                  <i className="pi pi-plus"></i> Add Size
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  <i className="pi pi-tags"></i> Price (VND) *
                </label>
                <input
                  type="text"
                  value={variant.price}
                  onChange={(e) => handlePriceChange(index, e.target.value)}
                  className="h-12 w-full rounded-xl border border-gray-200 bg-[#E6F2F5] px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A8DCE7] transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  placeholder="Enter price (e.g., 99000)"
                />
              </div>
            </div>
          ))}

        {showVariants && (
          <div className="mb-6">
            <button
              type="button"
              onClick={handleAddVariant}
              className="text-[#A8DCE7] hover:text-[#95C8D2] text-sm flex items-center gap-2 transition-colors duration-300"
            >
              <i className="pi pi-plus"></i> Add Another Variant
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="h-12 rounded-xl bg-[#A8DCE7] px-6 py-3 text-sm font-medium text-gray-800 hover:bg-[#95C8D2] focus:ring-2 focus:ring-[#A8DCE7] focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 justify-center"
          >
            <i className="pi pi-sync"></i>{' '}
            {productToEdit ? 'Update Product' : 'Save Product'}
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
  );
};

export default ProductFormModal;
