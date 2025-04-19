import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';
import React from 'react';

const getMenuByRole = (role: string) => {
  console.log('Role in getMenuByRole:', role);  

  const fullMenu = [
    {
      icon: <i className="pi pi-th-large" />,
      name: 'Dashboard',
      path: '/admin',
    },
    {
      icon: <i className="pi pi-calendar" />,
      name: 'Calendar',
      path: '/admin/calendar',
    },
    {
      icon: <i className="pi pi-user" />,
      name: 'User Profile',
      path: '/admin/profile',
    },
    {
      icon: <i className="pi pi-cog" />,
      name: 'Management',
      subItems: [
        { name: 'Form Elements', path: '/admin/form-elements', pro: false },
        { name: 'Order Management', path: '/admin/order-management', pro: false },
        { name: 'User Management', path: '/admin/user-management', pro: false },
        { name: 'Product Features', path: '/admin/product-features', pro: false },
      ],
    },
    {
      icon: <i className="pi pi-table" />,
      name: 'Tables',
      subItems: [{ name: 'Basic Tables', path: '/admin/basic-tables', pro: false }],
    },
    {
      icon: <i className="pi pi-file" />,
      name: 'Pages',
      subItems: [
        { name: 'Blank Page', path: '/admin/blank', pro: false },
        { name: '404 Error', path: '/admin/error-404', pro: false },
      ],
    },
  ];

  switch (role) {
    case 'admin':
      return fullMenu;
    case 'sale_manager':
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
    case 'product_manager':
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
      ];
    default:
      console.warn('Unknown role:', role); 
      return [];
  }
};

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar()!;
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('Current user in AppSidebar:', user); 
  const menuItems = getMenuByRole(user.role || '');

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  const renderMenuItems = (items) => {
    if (!items.length) {
      console.warn('No menu items to render'); 
      return <div className="text-gray-500 p-4">No menu available for this role</div>;
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
                    className={`menu-item group ${isActive(subItem.path) ? 'menu-item-active' : 'menu-item-inactive'
                      }`}
                  >
                    <span
                      className={`menu-item-icon-size ${isActive(subItem.path)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive'
                        }`}
                    >
                      {nav.icon || <i className="pi pi-circle" />}
                    </span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="menu-item-text">{subItem.name}</span>
                    )}
                  </Link>
                </li>
              ))
            ) : (
              <li>
                <Link
                  to={nav.path}
                  className={`menu-item group ${isActive(nav.path) ? 'menu-item-active' : 'menu-item-inactive'
                    }`}
                >
                  <span
                    className={`menu-item-icon-size ${isActive(nav.path)
                      ? 'menu-item-icon-active'
                      : 'menu-item-icon-inactive'
                      }`}
                  >
                    {nav.icon || <i className="pi pi-circle" />}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
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
        ${isExpanded || isMobileOpen
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
        className={`py-8 flex ${!isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
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
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
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