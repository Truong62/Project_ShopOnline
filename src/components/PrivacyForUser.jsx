import React from 'react';

const policies = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgb(65,179,199)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    ),
    title: 'Chính hãng 100%',
    description: 'Giày nhập từ Adidas, Nike US, Converse, ...',
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgb(65,179,199)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1" y="3" width="22" height="5" rx="2"></rect>
        <rect x="1" y="16" width="22" height="5" rx="2"></rect>
        <path d="M12 6v13"></path>
        <path d="M16 7v11"></path>
        <path d="M8 7v11"></path>
      </svg>
    ),
    title: 'Miễn phí vận chuyển',
    description: 'Áp dụng cho đơn hàng trên 1 triệu',
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgb(65,179,199)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
      </svg>
    ),
    title: 'Kho giày cực khủng',
    description: 'Đa dạng mẫu mã, màu sắc, dễ dàng chọn lựa',
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgb(65,179,199)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
      </svg>
    ),
    title: 'Đặt hàng online: 0971443180',
    description: 'Tư vấn chuyên nghiệp, chuẩn size',
  },
];

const PolicyComponent = () => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg shadow-sm p-4 transition-all duration-300 hover:shadow-md">
      {policies.map((policy, index) => (
        <div
          key={index}
          className="flex items-center p-3 border-b last:border-0 transition-all duration-200 hover:bg-[rgba(65,179,199,0.05)] rounded-md"
        >
          <div className="w-10 h-10 mr-3 flex-shrink-0 flex items-center justify-center rounded-full bg-[rgba(65,179,199,0.1)]">
            {policy.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{policy.title}</h3>
            <p className="text-gray-600 text-sm">{policy.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PolicyComponent;
