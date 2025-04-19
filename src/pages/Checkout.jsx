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
import { motion } from 'framer-motion';

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

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  return (
    <>
      <Header />
      <div className="min-h-screen py-12 px-4 sm:px-6">
        <motion.div
          className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="p-6 bg-gradient-to-r from-[#A8DCE7] to-[#79c2d2] mb-8">
            <h1 className="text-3xl font-bold text-white">Checkout</h1>
          </div>

          <div className="flex flex-col md:flex-row p-6">
            <motion.div
              className="w-full md:w-1/2 md:pr-8"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
            >
              <div className="bg-[#f7fcfd] rounded-xl p-6 mb-6 shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-[#2c7d90] border-b-2 border-[#A8DCE7] pb-2">
                  Your Order
                </h2>

                <motion.div
                  className="space-y-4 mb-6"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {Array.isArray(cartItems) &&
                    cartItems.map((item) => (
                      <motion.div
                        key={`${item.id}-${item.color}-${item.size}`}
                        className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                        variants={itemAnimation}
                      >
                        <div className="w-24 h-24 overflow-hidden rounded-lg mr-4 border-2 border-[#A8DCE7]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Size:{' '}
                            <span className="font-medium">{item.size}</span>,
                            Qty:{' '}
                            <span className="font-medium">{item.quantity}</span>
                            , Color:{' '}
                            <span className="font-medium">{item.color}</span>
                          </p>
                          <p className="font-bold text-[#2c7d90]">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                </motion.div>

                <div className="bg-[#e6f7fa] p-4 rounded-lg">
                  <h2 className="text-xl font-bold text-[#2c7d90] mb-2">
                    Order Summary
                  </h2>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-[#2c7d90]">
                      {Array.isArray(cartItems) &&
                        formatCurrency(
                          cartItems.reduce(
                            (total, item) => total + item.price * item.quantity,
                            0
                          )
                        )}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="w-full md:w-1/2"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <div className="bg-[#f7fcfd] rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-[#2c7d90] border-b-2 border-[#A8DCE7] pb-2">
                  Shipping Information
                </h2>
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
                        <div className="relative">
                          <InputText
                            id="fullName"
                            name="fullName"
                            value={values.fullName}
                            onChange={(e) =>
                              setFieldValue('fullName', e.target.value)
                            }
                            placeholder="Enter your full name"
                            className={`w-full p-3 pl-4 border rounded-lg transition-all duration-300 ${
                              errors.fullName && touched.fullName
                                ? 'border-red-500'
                                : 'border-[#A8DCE7] focus:ring-2 focus:ring-[#79c2d2]'
                            }`}
                          />
                          <i className="pi pi-user absolute top-3 right-3 text-[#79c2d2]"></i>
                        </div>
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
                        <div className="relative">
                          <InputText
                            id="email"
                            name="email"
                            value={values.email}
                            onChange={(e) =>
                              setFieldValue('email', e.target.value)
                            }
                            placeholder="Enter your email"
                            className={`w-full p-3 pl-4 border rounded-lg transition-all duration-300 ${
                              errors.email && touched.email
                                ? 'border-red-500'
                                : 'border-[#A8DCE7] focus:ring-2 focus:ring-[#79c2d2]'
                            }`}
                          />
                          <i className="pi pi-envelope absolute top-3 right-3 text-[#79c2d2]"></i>
                        </div>
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
                        <div className="relative">
                          <InputText
                            id="phoneNumber"
                            name="phoneNumber"
                            value={values.phoneNumber}
                            onChange={(e) =>
                              setFieldValue('phoneNumber', e.target.value)
                            }
                            placeholder="Enter your phone number"
                            className={`w-full p-3 pl-4 border rounded-lg transition-all duration-300 ${
                              errors.phoneNumber && touched.phoneNumber
                                ? 'border-red-500'
                                : 'border-[#A8DCE7] focus:ring-2 focus:ring-[#79c2d2]'
                            }`}
                          />
                          <i className="pi pi-phone absolute top-3 right-3 text-[#79c2d2]"></i>
                        </div>
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
                        <div className="relative">
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
                            className={`w-full p-3 pl-4 border rounded-lg transition-all duration-300 ${
                              errors.detailAddress && touched.detailAddress
                                ? 'border-red-500'
                                : 'border-[#A8DCE7] focus:ring-2 focus:ring-[#79c2d2]'
                            }`}
                          />
                          <i className="pi pi-map-marker absolute top-3 right-3 text-[#79c2d2]"></i>
                        </div>
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
                          onChange={(e) =>
                            handleProvinceChange(e, setFieldValue)
                          }
                          placeholder="Select Province"
                          className={`w-full border rounded-lg transition-all duration-300
                            ${
                              errors.selectedProvince &&
                              touched.selectedProvince
                                ? 'border-red-500'
                                : 'border-[#A8DCE7] hover:border-[#79c2d2]'
                            }
                          `}
                          panelClassName="max-h-60 overflow-auto rounded-lg shadow-lg bg-white border border-[#A8DCE7] p-2"
                        />
                        {errors.selectedProvince &&
                          touched.selectedProvince && (
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
                          onChange={(e) =>
                            handleDistrictChange(e, setFieldValue)
                          }
                          placeholder="Select District"
                          className={`w-full border rounded-lg transition-all duration-300
                            ${
                              errors.selectedDistrict &&
                              touched.selectedDistrict
                                ? 'border-red-500'
                                : 'border-[#A8DCE7] hover:border-[#79c2d2]'
                            }
                          `}
                          panelClassName="max-h-60 overflow-auto rounded-lg shadow-lg bg-white border border-[#A8DCE7] p-2"
                        />
                        {errors.selectedDistrict &&
                          touched.selectedDistrict && (
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
                          className={`w-full border rounded-lg transition-all duration-300
                            ${
                              errors.selectedWard && touched.selectedWard
                                ? 'border-red-500'
                                : 'border-[#A8DCE7] hover:border-[#79c2d2]'
                            }
                          `}
                          panelClassName="max-h-60 overflow-auto rounded-lg shadow-lg bg-white border border-[#A8DCE7] p-2"
                        />
                        {errors.selectedWard && touched.selectedWard && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.selectedWard}
                          </p>
                        )}
                      </div>

                      <motion.button
                        type="submit"
                        className="w-full py-4 bg-[#79c2d2] text-white font-semibold rounded-lg hover:bg-[#5ca9bd] transition-all duration-300 col-span-2 mt-4 shadow-md"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Checkout
                      </motion.button>
                    </Form>
                  )}
                </Formik>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
