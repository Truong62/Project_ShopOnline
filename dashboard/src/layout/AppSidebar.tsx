import { useCallback, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';
import React from 'react';

const getMenuByRole = (roles: string) => {
  localStorage.getItem('role');
  const role = localStorage.getItem('role');
  console.log('Role từ localStorage:', role);

  switch (roles) {
    case 'admin':
      return [
        {
          icon: <i className="pi pi-th-large" />,
          name: 'Dashboard',
          path: '/admin',
        },
        {
          icon: <i className="pi pi-user" />,
          name: 'User Profile',
          path: '/admin/profile',
        },
        {
          icon: <i className="pi pi-users" />,
          name: 'User Management',
          path: '/admin/user-management',
        },
        {
          icon: <i className="pi pi-shopping-cart" />,
          name: 'Order Management',
          path: '/admin/order-management',
        },
        {
          icon: <i className="pi pi-box" />,
          name: 'Product Features',
          path: '/admin/product-features',
        },
        {
          icon: <i className="pi pi-tags" />,
          name: 'Brand Management',
          path: '/admin/brand-management',
        },
      ];
    case 'SaleManager':
      return [
        {
          icon: <i className="pi pi-th-large" />,
          name: 'Dashboard',
          path: '/admin',
        },
        {
          icon: <i className="pi pi-user" />,
          name: 'User Profile',
          path: '/admin/profile',
        },
        {
          icon: <i className="pi pi-shopping-cart" />,
          name: 'Order Management',
          path: '/admin/order-management',
        },
      ];
    case 'Staff':
      return [
        {
          icon: <i className="pi pi-th-large" />,
          name: 'Dashboard',
          path: '/admin',
        },
        {
          icon: <i className="pi pi-user" />,
          name: 'User Profile',
          path: '/admin/profile',
        },
        {
          icon: <i className="pi pi-shopping-cart" />,
          name: 'Order Management',
          path: '/admin/order-management',
        },
      ];
    case 'ProductManager':
      return [
        {
          icon: <i className="pi pi-th-large" />,
          name: 'Dashboard',
          path: '/admin',
        },
        {
          icon: <i className="pi pi-user" />,
          name: 'User Profile',
          path: '/admin/profile',
        },
        {
          icon: <i className="pi pi-box" />,
          name: 'Product Features',
          path: '/admin/product-features',
        },
        {
          icon: <i className="pi pi-tags" />,
          name: 'Brand Management',
          path: '/admin/brand-management',
        },
      ];
    default:
      console.warn('Unknown role, returning minimal menu:', roles);
      return [
        {
          icon: <i className="pi pi-th-large" />,
          name: 'Dashboard',
          path: '/admin',
        },
      ];
  }
};

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar()!;
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || ''; // ví dụ: "Admin"

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('Current user in AppSidebar:', user);

  useEffect(() => {
    if (!user || !user.role) {
      console.warn('No valid user, redirecting to Signin');
      navigate('/admin');
    }
  }, [user, navigate]);

  const menuItems = getMenuByRole(role);
  console.log('Menu items:', menuItems);

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  const renderMenuItems = (items) => {
    if (!items.length) {
      console.warn('No menu items to render');
      return (
        <div className="text-gray-500 p-4">
          No menu available. Please sign in again.
        </div>
      );
    }
    return (
      <ul className="flex flex-col gap-4">
        {items.map((nav, index) => (
          <React.Fragment key={nav.name || `menu-${index}`}>
            {nav.subItems ? (
              nav.subItems.map((subItem) => (
                <li key={subItem.name}>
                  <Link
                    to={subItem.path}
                    className={`menu-item group flex items-center gap-4 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive(subItem.path)
                        ? 'bg-[#A8DCE7] text-gray-800 dark:bg-[#A8DCE7] dark:text-gray-800'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-[#E6F2F5] dark:hover:bg-[#E6F2F5] hover:text-gray-800 dark:hover:text-gray-800'
                    }`}
                  >
                    <span
                      className={`menu-item-icon-size text-lg ${
                        isActive(subItem.path)
                          ? 'text-gray-800 dark:text-gray-800'
                          : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-800'
                      }`}
                    >
                      {nav.icon || <i className="pi pi-circle" />}
                    </span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="menu-item-text text-sm font-medium">
                        {subItem.name}
                      </span>
                    )}
                  </Link>
                </li>
              ))
            ) : (
              <li>
                <Link
                  to={nav.path}
                  className={`menu-item group flex items-center gap-4 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive(nav.path)
                      ? 'bg-[#A8DCE7] text-gray-800 dark:bg-[#A8DCE7] dark:text-gray-800'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-[#E6F2F5] dark:hover:bg-[#E6F2F5] hover:text-gray-800 dark:hover:text-gray-800'
                  }`}
                >
                  <span
                    className={`menu-item-icon-size text-lg ${
                      isActive(nav.path)
                        ? 'text-gray-800 dark:text-gray-800'
                        : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-800'
                    }`}
                  >
                    {nav.icon || <i className="pi pi-circle" />}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text text-sm font-medium">
                      {nav.name}
                    </span>
                  )}
                </Link>
              </li>
            )}
          </React.Fragment>
        ))}
      </ul>
    );
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? 'w-[290px]'
            : isHovered
              ? 'w-[290px]'
              : 'w-[90px]'
        }
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? 'lg:justify-center'
                    : 'justify-start'
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  'Menu'
                ) : (
                  <i className="pi pi-ellipsis-h" />
                )}
              </h2>
              {renderMenuItems(menuItems)}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
