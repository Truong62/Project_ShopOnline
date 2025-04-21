import { useModal } from '../../hooks/useModal';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import React, { useState } from 'react';

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const loggedInUser = localStorage.getItem('loggedInUser');
      if (loggedInUser) {
        const parsed = JSON.parse(loggedInUser);
        // Giả định loggedInUser chứa { token, user: { name, email, ... } }
        return parsed.user || {};
      }
      return {};
    } catch (error) {
      console.error('Lỗi khi parse loggedInUser:', error);
      return {};
    }
  });
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    address: user.address || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSimpleSave = async () => {
    let token;
    try {
      const loggedInUser = localStorage.getItem('loggedInUser');
      if (!loggedInUser) {
        setErrorMsg('Vui lòng đăng nhập lại.');
        return;
      }
      const parsed = JSON.parse(loggedInUser);
      token = parsed.token || loggedInUser; // Nếu loggedInUser là token string hoặc chứa token
    } catch (error) {
      setErrorMsg('Dữ liệu đăng nhập không hợp lệ.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        'https://18.139.41.39:444/api/accounts/update',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      let data;
      try {
        data = await response.json();
      } catch (err) {
        throw new Error('Phản hồi từ server không phải JSON hợp lệ.');
      }

      if (!response.ok) {
        setErrorMsg(data.message || 'Cập nhật thông tin thất bại.');
      } else {
        const updatedUser = { ...user, ...formData };
        localStorage.setItem(
          'loggedInUser',
          JSON.stringify({ token, user: updatedUser })
        );
        setUser(updatedUser);
        setSuccessMsg('Cập nhật thông tin thành công!');
        setErrorMsg('');
        closeModal();
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      setErrorMsg(error.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp.');
      return;
    }

    let token;
    try {
      const loggedInUser = localStorage.getItem('loggedInUser');
      if (!loggedInUser) {
        setErrorMsg('Vui lòng đăng nhập lại.');
        return;
      }
      const parsed = JSON.parse(loggedInUser);
      token = parsed.token || loggedInUser;
    } catch (error) {
      setErrorMsg('Dữ liệu đăng nhập không hợp lệ.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        'https://18.139.41.39:444/api/accounts/password-change',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        }
      );

      let data;
      try {
        data = await response.json();
      } catch (err) {
        throw new Error('Phản hồi từ server không phải JSON hợp lệ.');
      }

      if (!response.ok) {
        if (response.status === 401) {
          setErrorMsg('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
        } else if (response.status === 400) {
          setErrorMsg(data.message || 'Mật khẩu cũ không đúng.');
        } else {
          setErrorMsg(data.message || 'Đổi mật khẩu thất bại.');
        }
      } else {
        setSuccessMsg('Đổi mật khẩu thành công!');
        setErrorMsg('');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        closeModal();
      }
    } catch (error) {
      console.error('Lỗi khi đổi mật khẩu:', error);
      setErrorMsg(error.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img src="/images/user/owner.jpg" alt="user" />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {user.name || 'Musharof Chowdhury'}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Team Manager
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Arizona, United States
                </p>
              </div>
            </div>
            <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
              <a
                href="https://www.facebook.com/PimjoHQ"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
              >
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.6666 11.2503H13.7499L14.5833 7.91699H11.6666V6.25033C11.6666 5.39251 11.6666 4.58366 13.3333 4.58366H14.5833V1.78374C14.3118 1.7477 13.2858 1.66699 12.2023 1.66699C9.94025 1.66699 8.33325 3.04771 8.33325 5.58342V7.91699H5.83325V11.2503H8.33325V18.3337H11.6666V11.2503Z"
                    fill=""
                  />
                </svg>
              </a>
              {/* Các liên kết mạng xã hội khác giữ nguyên */}
            </div>
          </div>
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Sửa
          </button>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Chỉnh sửa thông tin cá nhân
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Cập nhật thông tin để giữ hồ sơ của bạn luôn mới.
            </p>
            {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
            {successMsg && (
              <p className="text-sm text-green-600">{successMsg}</p>
            )}
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Đổi mật khẩu
                </h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label htmlFor="oldPassword" className="form-label">
                      Mật khẩu cũ
                    </Label>
                    <Input
                      type="password"
                      id="oldPassword"
                      name="oldPassword"
                      placeholder="Nhập mật khẩu cũ"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      min={1}
                      max={100}
                      step={1}
                      hint="Nhập mật khẩu cũ của bạn"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword" className="form-label">
                      Mật khẩu mới
                    </Label>
                    <Input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      placeholder="Nhập mật khẩu mới"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      min={1}
                      max={100}
                      step={1}
                      hint="Nhập mật khẩu mới của bạn"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="form-label">
                      Xác nhận mật khẩu mới
                    </Label>
                    <Input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Xác nhận mật khẩu mới"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      min={1}
                      max={100}
                      step={1}
                      hint="Xác nhận mật khẩu mới của bạn"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Thông tin cá nhân
                </h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="name" className="form-label">
                      Họ tên
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Nhập họ tên"
                      value={formData.name}
                      onChange={handleInputChange}
                      hint="Nhập họ tên đầy đủ"
                      min={1}
                      max={100}
                      step={1}
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="email" className="form-label">
                      Email
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Nhập email"
                      value={formData.email}
                      onChange={handleInputChange}
                      hint="Nhập email hợp lệ"
                      min={1}
                      max={100}
                      step={1}
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="phoneNumber" className="form-label">
                      Số điện thoại
                    </Label>
                    <Input
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="Nhập số điện thoại"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      hint="Nhập số điện thoại hợp lệ"
                      min={1}
                      max={100}
                      step={1}
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="address" className="form-label">
                      Địa chỉ
                    </Label>
                    <Input
                      type="text"
                      id="address"
                      name="address"
                      placeholder="Nhập địa chỉ"
                      value={formData.address}
                      onChange={handleInputChange}
                      hint="Nhập địa chỉ của bạn"
                      min={1}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={closeModal}
                startIcon={null}
                endIcon={null}
                disabled={loading}
              >
                Đóng
              </Button>
              <Button
                size="sm"
                onClick={handleSimpleSave}
                startIcon={null}
                endIcon={null}
                disabled={loading}
              >
                Lưu thay đổi
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                startIcon={null}
                endIcon={null}
                disabled={loading}
              >
                Đổi mật khẩu
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
