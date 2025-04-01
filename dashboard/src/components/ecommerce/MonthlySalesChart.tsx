import React, { useState } from 'react';
import { Chart } from 'primereact/chart';
import { Dropdown } from 'primereact/dropdown'; // Import the correct Dropdown component

export default function MonthlySalesChart() {
  const data = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ],
    datasets: [
      {
        label: 'Sales',
        backgroundColor: '#465fff',
        data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Outfit, sans-serif',
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: true,
        },
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  // Dropdown options (actions)
  const dropdownOptions = [
    { label: 'View More', value: 'view_more' },
    { label: 'Delete', value: 'delete' },
  ];

  // Handle dropdown item selection
  const handleDropdownChange = (e: { value: string }) => {
    console.log(e.value); // Handle the selected action (e.g., 'view_more', 'delete')
    closeDropdown(); // Close the dropdown after selection
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Sales
        </h3>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <i className=" pi-ellipsis-v text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown
            value={null} // You can use a state variable to manage the selected value if needed
            options={dropdownOptions}
            onChange={handleDropdownChange}
            placeholder="Actions"
            className="w-40 p-2"
            panelClassName="p-2"
            onFocus={closeDropdown} // Close the dropdown when focused outside
          />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart type="bar" data={data} options={options} height="180px" />
        </div>
      </div>
    </div>
  );
}
