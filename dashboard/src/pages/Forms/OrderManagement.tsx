import React, { useState } from "react";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import { formatCurrency } from "../../../../src/utils/formatCurrency";
type OrderStatus = "pending" | "paid" | "delivering" | "delivered" | "cancelled";

interface Order {
    id: number;
    product: string;
    shippingAddress: string;
    senderName: string;
    phone: string;
    quantity: number;
    price: number;
    status: OrderStatus;
    isCancelled: boolean;
    type?: "light" | "heavy";
    paymentTypeId?: number;
    serviceTypeId?: number;
    requiredNote?: string;
    note?: string;
    imageUrl?: string;
}

export default function OrderManagement() {
    const [orders, setOrders] = useState<Order[]>([
        {
            id: 1,
            product: "Áo thun",
            shippingAddress: "123 Đường A, Quận 1",
            senderName: "Nguyễn Văn A",
            phone: "0901234567",
            quantity: 2,
            status: "pending",
            isCancelled: false,
            price: 200000,
            imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/1983f2e1-0271-479c-bada-6176a571fa4f/NIKE+VOMERO+18.png",
        },
        {
            id: 2,
            product: "Giày thể thao",
            shippingAddress: "456 Đường B, Quận 3",
            senderName: "Trần Thị B",
            phone: "0909876543",
            quantity: 1,
            status: "paid",
            isCancelled: false,
            price: 800000,
            imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/bcc74905-983b-4bf5-8417-6c187b8758c8/NIKE+VOMERO+18.png",
        },
        {
            id: 3,
            product: "Balo",
            shippingAddress: "789 Đường C, Quận 5",
            senderName: "Lê Văn C",
            phone: "0911222333",
            quantity: 3,
            status: "delivering",
            isCancelled: false,
            price: 300000,
            imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/4ae3c0d4-1573-4842-9b01-5589cb11f359/NIKE+VOMERO+18.png",
        },
    ]);


    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [orderWeight, setOrderWeight] = useState<"light" | "heavy">("light");
    const [paymentTypeId, setPaymentTypeId] = useState<number>(1);
    const [serviceTypeId, setServiceTypeId] = useState<number>(1);
    const [requiredNote, setRequiredNote] = useState<string>("CHOTHUHANG");
    const [note, setNote] = useState<string>("");
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewOrder, setViewOrder] = useState<Order | null>(null);


    const handleCancel = (id: number) => {
        setOrders((prev) =>
            prev.map((order) =>
                order.id === id
                    ? { ...order, status: "cancelled", isCancelled: true }
                    : order
            )
        );
    };

    const handleCreateOrder = (order: Order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleConfirmOrder = () => {
        if (!selectedOrder) return;

        const updatedOrder = {
            ...selectedOrder,
            status: "delivering", // đổi trạng thái ở đây
            type: orderWeight,
            paymentTypeId,
            serviceTypeId,
            requiredNote,
            ...(note.trim() && { note }), // chỉ thêm note nếu có ghi
        };

        console.log("Tạo đơn hàng:", updatedOrder);

        setOrders((prev) =>
            prev.map((o) =>
                o.id === selectedOrder.id ? { ...o, status: "delivering" } : o
            )
        );

        setShowModal(false);
    };



    return (

        <div className="p-4 md:p-6">
            <form action="https://formbold.com/s/unique_form_id" method="POST">
                <div className="relative">
                    <button className="absolute -translate-y-1/2 left-4 top-1/2">
                        <svg
                            className="fill-gray-500 dark:fill-gray-400"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                                fill=""
                            />
                        </svg>
                    </button>
                    <input
                        type="text"
                        placeholder="Search ID..."
                        className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                    />
                </div>
            </form>
            <h2 className="text-xl font-bold mb-4">Order Management</h2>

            {/* Bảng đơn hàng */}
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 text-left">ID</th>
                            <th className="p-2 text-left">Tên</th>
                            <th className="p-2 text-left">SL</th>
                            <th className="p-2 text-left">Giá</th>
                            <th className="p-2 text-left">Trạng thái</th>
                            <th className="p-2 text-left">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-t border-gray-200">
                                <td className="p-2">{order.id}</td>
                                <td className="p-2">{order.product}</td>
                                <td className="p-2">{order.quantity}</td>
                                <td className="p-2">{formatCurrency(order.price)}</td>
                                <td className="p-2">
                                    <select
                                        value={order.status}
                                        disabled={order.isCancelled}
                                        onChange={(e) => {
                                            const newStatus = e.target.value as OrderStatus;
                                            setOrders((prev) =>
                                                prev.map((o) =>
                                                    o.id === order.id ? { ...o, status: newStatus } : o
                                                )
                                            );
                                        }}
                                        className="border p-1 rounded w-full"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                        <option value="delivering">Delivering</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td className="p-2 space-x-1 whitespace-nowrap">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setViewOrder(order);
                                            setViewModalOpen(true);

                                        }}
                                        startIcon={null}
                                        endIcon={null}
                                    >
                                        View
                                    </Button>

                                    <Button
                                        onClick={() => handleCreateOrder(order)}
                                        disabled={order.isCancelled} // disable nếu đã bị hủy
                                        startIcon={null}
                                        endIcon={null}
                                    >
                                        Create Order
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleCancel(order.id)}
                                        disabled={order.isCancelled} // disable nếu đã bị hủy
                                        startIcon={null}
                                        endIcon={null}
                                    >
                                        Cancel
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal
                isOpen={viewModalOpen}
                onClose={() => setViewModalOpen(false)}
                className="max-w-xl w-full mx-auto rounded-md"
            >
                <div className="p-6 space-y-6">
                    <h3 className="text-2xl font-semibold text-gray-800 border-b pb-2">Chi tiết đơn hàng</h3>

                    {viewOrder && (
                        <>
                            <div className="flex flex-col sm:flex-row gap-6">
                                {/* Hình ảnh sản phẩm */}
                                <div className="w-full sm:w-1/2">
                                    <img
                                        src={viewOrder.imageUrl}
                                        alt={viewOrder.product}
                                        className="w-full h-60 object-cover rounded-xl shadow-sm border"
                                    />
                                </div>

                                {/* Thông tin chi tiết */}
                                <div className="w-full sm:w-1/2 text-sm space-y-2 text-gray-700">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{`ID:`}</span>
                                        <span>{viewOrder.id}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Tên sản phẩm:</span>
                                        <span>{viewOrder.product}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Giá:</span>
                                        <span>{`${formatCurrency(viewOrder.price)}`}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Số lượng:</span>
                                        <span>{viewOrder.quantity}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Người gửi:</span>
                                        <span>{viewOrder.senderName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Điện thoại:</span>
                                        <span>{viewOrder.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Địa chỉ:</span>
                                        <span>{viewOrder.shippingAddress}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Trạng thái:</span>
                                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium
              ${viewOrder.status === 'delivered'
                                                ? 'bg-green-100 text-green-700'
                                                : viewOrder.status === 'delivering'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-gray-100 text-gray-700'}
            `}>
                                            {viewOrder.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Nút đóng */}
                            <div className="flex justify-end pt-4">
                                <Button variant="ghost" onClick={() => setViewModalOpen(false)} startIcon={null} endIcon={null}>
                                    Đóng
                                </Button>
                            </div>
                        </>
                    )}
                </div>

            </Modal>

            {/* Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                className="max-w-2xl w-full mx-auto rounded-md"
            >
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Tạo đơn hàng</h3>

                    {selectedOrder && (
                        <>
                            {/* Thông tin đơn hàng */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
                                <div><span className="font-medium">ID:</span> {selectedOrder.id}</div>
                                <div><span className="font-medium">Tên đơn hàng:</span> {selectedOrder.product}</div>
                                <div><span className="font-medium">Số lượng:</span> {selectedOrder.quantity}</div>
                                <div><span className="font-medium">SĐT:</span> {selectedOrder.phone}</div>
                                <div className="sm:col-span-2"><span className="font-medium">Địa chỉ gửi hàng:</span> {selectedOrder.shippingAddress}</div>
                                <div className="sm:col-span-2"><span className="font-medium">Người gửi:</span> {selectedOrder.senderName}</div>
                            </div>

                            {/* Form chọn thông tin bổ sung */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                {/* Loại đơn hàng */}
                                <div>
                                    <label className="block font-medium mb-1 text-gray-700">Loại đơn hàng</label>
                                    <select
                                        value={orderWeight}
                                        onChange={(e) => setOrderWeight(e.target.value as "light" | "heavy")}
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                    >
                                        <option value="light">Đơn hàng nhẹ</option>
                                        <option value="heavy">Đơn hàng nặng</option>
                                    </select>
                                </div>

                                {/* Ghi chú bắt buộc */}
                                <div>
                                    <label className="block font-medium mb-1 text-gray-700">Ghi chú bắt buộc</label>
                                    <select
                                        value={requiredNote}
                                        onChange={(e) => setRequiredNote(e.target.value)}
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                    >
                                        <option value="CHOTHUHANG">Cho thử hàng</option>
                                        <option value="CHOXEMHANGKHONGTHU">Cho xem hàng không thu</option>
                                        <option value="KHONGCHOXEMHANG">Không cho xem hàng</option>
                                    </select>
                                </div>

                                {/* Loại dịch vụ */}
                                <div>
                                    <label className="block font-medium mb-1 text-gray-700">Loại dịch vụ</label>
                                    <select
                                        value={serviceTypeId}
                                        onChange={(e) => setServiceTypeId(Number(e.target.value))}
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                    >
                                        <option value={1}>Bay</option>
                                        <option value={2}>Đi Bộ</option>
                                    </select>
                                </div>

                                {/* Người thanh toán */}
                                <div>
                                    <label className="block font-medium mb-1 text-gray-700">Người thanh toán phí</label>
                                    <select
                                        value={paymentTypeId}
                                        onChange={(e) => setPaymentTypeId(Number(e.target.value))}
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                    >
                                        <option value={1}>Người gửi</option>
                                        <option value={2}>Người nhận</option>
                                    </select>
                                </div>
                            </div>

                            {/* Ghi chú thêm */}
                            <div className="mt-4">
                                <label className="block font-medium mb-1 text-gray-700">Ghi chú thêm (tuỳ chọn)</label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    rows={3}
                                    placeholder="Ví dụ: giao vào buổi sáng, gọi trước khi giao..."
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                />
                            </div>
                        </>
                    )}

                    {/* Hành động */}
                    <div className="flex justify-end space-x-3 mt-6">
                        <Button variant="ghost" onClick={() => setShowModal(false)} startIcon={null} endIcon={null}>
                            Hủy
                        </Button>
                        <Button onClick={handleConfirmOrder} startIcon={null} endIcon={null}>
                            Xác nhận
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );

}
