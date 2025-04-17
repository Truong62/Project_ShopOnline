import React, { useEffect, useState, useCallback, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { formatCurrency } from '../utils/formatCurrency';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';

const CheckoutPage = () => {
  const reduxCartItems = useSelector((state) => state.cart.items);
  const [cartItems, setCartItems] = useState([]);

  // const navigate = useNavigate();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const buyNowItem = localStorage.getItem('buyNowTempProduct');
    const localCart = localStorage.getItem('cart');

    if (buyNowItem) {
      try {
        const parsed = JSON.parse(buyNowItem);
        const normalized = Array.isArray(parsed) ? parsed : [parsed];
        setCartItems(normalized);
      } catch (err) {
        console.error(
          'Failed to parse buyNowTempProduct from localStorage',
          err
        );
        setCartItems([]);
      }
    } else if (localCart) {
      try {
        const parsedCart = JSON.parse(localCart);
        const normalizedCart = Array.isArray(parsedCart)
          ? parsedCart
          : [parsedCart];
        setCartItems(normalizedCart);
      } catch (err) {
        console.error('Failed to parse cart from localStorage', err);
        setCartItems([]);
      }
    } else {
      setCartItems(reduxCartItems); // fallback cuối cùng nếu localStorage trống
    }
  }, [reduxCartItems]);

  useEffect(() => {
    axios
      .get('https://provinces.open-api.vn/api/?depth=1')
      .then((response) => setProvinces(response.data))
      .catch((error) => console.error('Error fetching provinces:', error));
  }, []);

  const handleProvinceChange = useCallback((e, setFieldValue) => {
    const provinceCode = e.value;
    setFieldValue('selectedProvince', provinceCode);
    axios
      .get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
      .then((response) => {
        setDistricts(response.data.districts);
        setWards([]);
        setFieldValue('selectedDistrict', '');
        setFieldValue('selectedWard', '');
      })
      .catch((error) => console.error('Error fetching districts:', error));
  }, []);

  const handleDistrictChange = useCallback((e, setFieldValue) => {
    const districtCode = e.value;
    setFieldValue('selectedDistrict', districtCode);
    axios
      .get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      .then((response) => {
        setWards(response.data.wards);
        setFieldValue('selectedWard', '');
      })
      .catch((error) => console.error('Error fetching wards:', error));
  }, []);

  const handleWardChange = useCallback((e, setFieldValue) => {
    const wardCode = e.value;
    setFieldValue('selectedWard', wardCode);
  }, []);

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        fullName: Yup.string().required('Full name is required'),
        email: Yup.string()
          .email('Invalid email')
          .required('Email is required'),
        phoneNumber: Yup.string()
          .required('Phone number is required')
          .min(9, 'Phone number must have at least 9 characters')
          .max(11, 'Phone number must have at most 11 characters')
          .matches(/^[0-9]+$/, 'Phone number must be numeric'),
        detailAddress: Yup.string().required('Address is required'),
        selectedProvince: Yup.string().required('Province is required'),
        selectedDistrict: Yup.string().required('District is required'),
        selectedWard: Yup.string().required('Ward is required'),
      }),
    []
  );

  const handleCheckout = useCallback(
    (values) => {
      const selectedProvince =
        provinces.find((p) => p.code === values.selectedProvince)?.name || '';
      const selectedDistrict =
        districts.find((d) => d.code === values.selectedDistrict)?.name || '';
      const selectedWard =
        wards.find((w) => w.code === values.selectedWard)?.name || '';

      const orderData = {
        ...values,
        selectedProvince,
        selectedDistrict,
        selectedWard,
        cartItems,
      };

      console.log('Order Information:', orderData);
      // axios.post('/api/checkout', orderData).then(...).catch(...);
    },
    [cartItems, provinces, districts, wards]
  );

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-4">
            <h2 className="text-2xl font-bold mb-4">Your Order</h2>
            <h2 className="text-2xl font-bold">Order Summary</h2>
            <div className="flex justify-between font-bold mb-4">
              <span>Total</span>
              <span className="text-red-500">
                {Array.isArray(cartItems) &&
                  formatCurrency(
                    cartItems.reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    )
                  )}
              </span>
            </div>
            {Array.isArray(cartItems) &&
              cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.color}-${item.size}`}
                  className="flex items-center mb-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 mr-4"
                  />
                  <div>
                    <p>{item.name}</p>
                    <p>
                      Size: {item.size}, Qty: {item.quantity}, Color:{' '}
                      {item.color}
                    </p>
                    <p>{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
          </div>
          <div className="w-full md:w-1/2 p-4">
            <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
            <Formik
              initialValues={{
                fullName: '',
                email: '',
                phoneNumber: '',
                detailAddress: '',
                selectedProvince: '',
                selectedDistrict: '',
                selectedWard: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleCheckout}
            >
              {({ setFieldValue, values, errors, touched }) => (
                <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label
                      htmlFor="fullName"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      Full Name
                    </label>
                    <InputText
                      id="fullName"
                      name="fullName"
                      value={values.fullName}
                      onChange={(e) =>
                        setFieldValue('fullName', e.target.value)
                      }
                      placeholder="Enter your full name"
                      className={`w-full p-3 border rounded-lg ${
                        errors.fullName && touched.fullName
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                    />
                    {errors.fullName && touched.fullName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      Email
                    </label>
                    <InputText
                      id="email"
                      name="email"
                      value={values.email}
                      onChange={(e) => setFieldValue('email', e.target.value)}
                      placeholder="Enter your email"
                      className={`w-full p-3 border rounded-lg ${
                        errors.email && touched.email
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                    />
                    {errors.email && touched.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      Phone Number
                    </label>
                    <InputText
                      id="phoneNumber"
                      name="phoneNumber"
                      value={values.phoneNumber}
                      onChange={(e) =>
                        setFieldValue('phoneNumber', e.target.value)
                      }
                      placeholder="Enter your phone number"
                      className={`w-full p-3 border rounded-lg ${
                        errors.phoneNumber && touched.phoneNumber
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                    />
                    {errors.phoneNumber && touched.phoneNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="detailAddress"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      Detail Address
                    </label>
                    <InputTextarea
                      id="detailAddress"
                      name="detailAddress"
                      autoResize
                      rows={2}
                      value={values.detailAddress}
                      onChange={(e) =>
                        setFieldValue('detailAddress', e.target.value)
                      }
                      placeholder="Enter your address"
                      className={`w-full p-3 border rounded-lg ${
                        errors.detailAddress && touched.detailAddress
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                    />
                    {errors.detailAddress && touched.detailAddress && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.detailAddress}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="province"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      Province
                    </label>
                    <Dropdown
                      value={values.selectedProvince}
                      options={provinces.map((p) => ({
                        label: p.name,
                        value: p.code,
                      }))}
                      onChange={(e) => handleProvinceChange(e, setFieldValue)}
                      placeholder="Select Province"
                      className={`w-full py-3 px-4 border rounded-xl transition duration-200
                        ${
                          errors.selectedProvince && touched.selectedProvince
                            ? 'border-red-500 focus:ring-2 focus:ring-red-400'
                            : 'border-gray-300 focus:ring-2 focus:ring-blue-400 hover:border-blue-500'
                        }
                      `}
                      panelClassName="max-h-60 overflow-auto rounded-lg shadow-lg bg-white border border-gray-200 p-2"
                    />
                    {errors.selectedProvince && touched.selectedProvince && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.selectedProvince}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="district"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      District
                    </label>
                    <Dropdown
                      value={values.selectedDistrict}
                      options={districts.map((d) => ({
                        label: d.name,
                        value: d.code,
                      }))}
                      onChange={(e) => handleDistrictChange(e, setFieldValue)}
                      placeholder="Select District"
                      className={`w-full py-3 px-4 border rounded-xl transition duration-200
                        ${
                          errors.selectedDistrict && touched.selectedDistrict
                            ? 'border-red-500 focus:ring-2 focus:ring-red-400'
                            : 'border-gray-300 focus:ring-2 focus:ring-blue-400 hover:border-blue-500'
                        }
                      `}
                      panelClassName="max-h-60 overflow-auto rounded-lg shadow-lg bg-white border border-gray-200 p-2"
                    />
                    {errors.selectedDistrict && touched.selectedDistrict && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.selectedDistrict}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="ward"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      Ward
                    </label>
                    <Dropdown
                      value={values.selectedWard}
                      options={wards.map((w) => ({
                        label: w.name,
                        value: w.code,
                      }))}
                      onChange={(e) => handleWardChange(e, setFieldValue)}
                      placeholder="Select Ward"
                      className={`w-full py-3 px-4 border rounded-xl transition duration-200
                        ${
                          errors.selectedWard && touched.selectedWard
                            ? 'border-red-500 focus:ring-2 focus:ring-red-400'
                            : 'border-gray-300 focus:ring-2 focus:ring-blue-400 hover:border-blue-500'
                        }
                      `}
                      panelClassName="max-h-60 overflow-auto rounded-lg shadow-lg bg-white border border-gray-200 p-2"
                    />
                    {errors.selectedWard && touched.selectedWard && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.selectedWard}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 col-span-2"
                  >
                    Checkout
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
