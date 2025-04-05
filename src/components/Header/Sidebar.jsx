import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';

const SidebarContainer = ({ visibleRight, setVisibleRight, activeLink }) => {
  return (
    <Sidebar
      visible={visibleRight}
      position="right"
      onHide={() => setVisibleRight(false)}
      className="w-80 md:w-96 p-sidebar-sm bg-white shadow-lg"
    >
      <div className="p-6 flex flex-col h-full">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Sneaker Store
        </h2>

        <ul className="list-none space-y-4 flex-1">
          {['Products', 'Order Status', 'Blogs', 'Company'].map((text) => (
            <li key={text}>
              <Link
                to={`/${text.toLowerCase()}`}
                className={`block text-lg font-semibold px-5 py-3 rounded-lg transition-all duration-300 ${
                  activeLink === `/${text.toLowerCase()}`
                    ? 'bg-[#A8DCE7] text-black'
                    : 'hover:bg-gray-200 text-gray-700'
                }`}
                onClick={() => setVisibleRight(false)}
              >
                {text}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-center space-x-2 flex-nowrap">
          <Link to="/login">
            <Button className="p-button-text  font-semibold">Log In</Button>
          </Link>
          <Link to="/register">
            <Button className="p-button-rounded text-gray-700 p-button-primary font-semibold">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </Sidebar>
  );
};

export default SidebarContainer;

SidebarContainer.propTypes = {
  setVisibleRight: PropTypes.func,
  visibleRight: PropTypes.bool,
  activeLink: PropTypes.string,
};
