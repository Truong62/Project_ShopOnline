import React, { useState, useEffect } from "react";
import { Modal } from "../../components/ui/modal";
import { formatCurrency } from "../../../../src/utils/formatCurrency";
import Alert from "../../components/ui/alert/Alert";

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

const initialOrders: Order[] = [
    {
        id: 1,
        product: "T-shirt",
        shippingAddress: "123 Street A, District 1",
        senderName: "John Doe",
        phone: "0901234567",
        quantity: 2,
        status: "pending",
        isCancelled: false,
        price: 200000,
        imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/1983f2e1-0271-479c-bada-6176a571fa4f/NIKE+VOMERO+18.png",
    },
    {
        id: 2,
        product: "Sneakers",
        shippingAddress: "456 Street B, District 3",
        senderName: "Jane Smith",
        phone: "0909876543",
        quantity: 1,
        status: "paid",
        isCancelled: false,
        price: 800000,
        imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/bcc74905-983b-4bf5-8417-6c187b8758c8/NIKE+VOMERO+18.png",
    },
    {
        id: 3,
        product: "Backpack",
        shippingAddress: "789 Street C, District 5",
        senderName: "Mike Johnson",
        phone: "0911222333",
        quantity: 3,
        status: "delivering",
        isCancelled: false,
        price: 300000,
        imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/4ae3c0d4-1573-4842-9b01-5589cb11f359/NIKE+VOMERO+18.png",
    },
];

const OrderTable: React.FC<{
    orders: Order[];
    onView: (order: Order) => void;
    onCreate: (order: Order) => void;
    onCancel: (id: number) => void;
}> = ({ orders, onView, onCreate, onCancel }) => {
    return (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {order.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {order.product}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {order.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {formatCurrency(order.price)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                <select
                                    value={order.status}
                                    disabled={order.isCancelled || order.status === "delivering"}
                                    onChange={(e) => {
                                        const newStatus = e.target.value as OrderStatus;
                                        orders.forEach((o) => {
                                            if (o.id === order.id) {
                                                o.status = newStatus;
                                            }
                                        });
                                        orders = [...orders];
                                    }}
                                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="delivering">Delivering</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() => onView(order)}
                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                                    title="View"
                                >
                                    <i className="pi pi-eye" />
                                </button>
                                <button
                                    onClick={() => onCreate(order)}
                                    disabled={order.isCancelled || order.status === "delivering"}
                                    className={`mr-4 ${order.isCancelled || order.status === "delivering"
                                        ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                        : "text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                        }`}
                                    title="Create"
                                >
                                    <i className="pi pi-plus-circle" />
                                </button>
                                <button
                                    onClick={() => onCancel(order.id)}
                                    disabled={order.isCancelled || order.status === "delivering"}
                                    className={`${order.isCancelled || order.status === "delivering"
                                        ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                        : "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                        }`}
                                    title="Cancel"
                                >
                                    <i className="pi pi-trash" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default function OrderManagement() {
    const [orders, setOrders] = useState<Order[]>(() => {
        try {
            const savedOrders = localStorage.getItem('orders');
            return savedOrders ? JSON.parse(savedOrders) : initialOrders;
        } catch (error) {
            console.error('Error parsing orders from localStorage:', error);
            return initialOrders;
        }
    });
    const [showModal, setShowModal] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [viewOrder, setViewOrder] = useState<Order | null>(null);
    const [orderWeight, setOrderWeight] = useState<"light" | "heavy">("light");
    const [paymentTypeId, setPaymentTypeId] = useState<number>(1);
    const [serviceTypeId, setServiceTypeId] = useState<number>(1);
    const [requiredNote, setRequiredNote] = useState<string>("CHOTHUHANG");
    const [note, setNote] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
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

    useEffect(() => {
        try {
            localStorage.setItem('orders', JSON.stringify(orders));
        } catch (error) {
            console.error('Error saving orders to localStorage:', error);
            showAlert('error', 'Storage Error', 'Failed to save orders to localStorage.');
        }
    }, [orders]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredOrders = orders.filter(
        (order) =>
            order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toString().includes(searchTerm) ||
            order.senderName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCancel = (id: number) => {
        const order = orders.find((o) => o.id === id);
        if (order?.status === 'delivering') {
            showAlert('error', 'Cannot Cancel', 'Orders in delivery cannot be cancelled.');
            return;
        }
        setOrders((prev) =>
            prev.map((order) =>
                order.id === id
                    ? { ...order, status: "cancelled", isCancelled: true }
                    : order
            )
        );
        showAlert('success', 'Success', `Order #${id} has been cancelled.`);
    };

    const handleCreateOrder = (order: Order) => {
        if (order.status === 'delivering') {
            showAlert('error', 'Cannot Create', 'Orders in delivery cannot be modified.');
            return;
        }
        setSelectedOrder(order);
        setOrderWeight(order.type || "light");
        setPaymentTypeId(order.paymentTypeId || 1);
        setServiceTypeId(order.serviceTypeId || 1);
        setRequiredNote(order.requiredNote || "CHOTHUHANG");
        setNote(order.note || "");
        setShowModal(true);
    };

    const handleConfirmOrder = () => {
        if (!selectedOrder) return;

        if (!orderWeight || !paymentTypeId || !serviceTypeId || !requiredNote) {
            showAlert('error', 'Validation Error', 'Please fill in all required fields.');
            return;
        }

        const updatedOrder: Order = {
            ...selectedOrder,
            status: "delivering",
            type: orderWeight,
            paymentTypeId,
            serviceTypeId,
            requiredNote,
            note: note.trim() || undefined,
        };

        setOrders((prev) =>
            prev.map((o) => (o.id === selectedOrder.id ? updatedOrder : o))
        );
        setShowModal(false);
        showAlert('success', 'Success', `Order #${selectedOrder.id} has been created successfully.`);
    };

    const handleViewOrder = (order: Order) => {
        setViewOrder(order);
        setViewModalOpen(true);
    };

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-6">
                Order Management
            </h2>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500"

                        xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
                        <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by ID, product, or sender..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-12 pr-4 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:placeholder:text-gray-500"
                    />
                </div>
            </div>

            {/* Alert */}
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

            {/* Table */}
            <OrderTable
                orders={filteredOrders}
                onView={handleViewOrder}
                onCreate={handleCreateOrder}
                onCancel={handleCancel}
            />

            {/* View Modal */}
            <Modal
                isOpen={viewModalOpen}
                onClose={() => setViewModalOpen(false)}
                className="max-w-xl w-full rounded-xl bg-white dark:bg-gray-800"
            >
                <div className="p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">
                            Order Details
                        </h3>
                        <button
                            onClick={() => setViewModalOpen(false)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <i className="pi pi-times text-xl" />
                        </button>
                    </div>
                    {viewOrder && (
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-6">
                                <img
                                    src={viewOrder.imageUrl}
                                    alt={viewOrder.product}
                                    className="w-full sm:w-1/2 h-48 object-cover rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                                />
                                <div className="w-full sm:w-1/2 text-sm text-gray-700 dark:text-gray-300 space-y-2">
                                    <div>
                                        <span className="font-medium">ID:</span> {viewOrder.id}
                                    </div>
                                    <div>
                                        <span className="font-medium">Product Name:</span>{" "}
                                        {viewOrder.product}
                                    </div>
                                    <div>
                                        <span className="font-medium">Price:</span>{" "}
                                        {formatCurrency(viewOrder.price)}
                                    </div>
                                    <div>
                                        <span className="font-medium">Quantity:</span>{" "}
                                        {viewOrder.quantity}
                                    </div>
                                    <div>
                                        <span className="font-medium">Sender:</span>{" "}
                                        {viewOrder.senderName}
                                    </div>
                                    <div>
                                        <span className="font-medium">Phone:</span>{" "}
                                        {viewOrder.phone}
                                    </div>
                                    <div>
                                        <span className="font-medium">Address:</span>{" "}
                                        {viewOrder.shippingAddress}
                                    </div>
                                    <div>
                                        <span className="font-medium">Status:</span>{" "}
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full font-medium ${viewOrder.status === "delivered"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                                                : viewOrder.status === "delivering"
                                                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                                                    : viewOrder.status === "cancelled"
                                                        ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                                                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                                                }`}
                                        >
                                            {viewOrder.status.charAt(0).toUpperCase() + viewOrder.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Create Order Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                className="max-w-2xl w-full rounded-xl bg-white dark:bg-gray-800"
            >
                <div className="p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">
                            Create Order
                        </h3>
                        <button
                            onClick={() => setShowModal(false)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <i className="pi pi-times text-xl" />
                        </button>
                    </div>
                    {selectedOrder && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                                <div>
                                    <span className="font-medium">ID:</span> {selectedOrder.id}
                                </div>
                                <div>
                                    <span className="font-medium">Order Name:</span>{" "}
                                    {selectedOrder.product}
                                </div>
                                <div>
                                    <span className="font-medium">Quantity:</span>{" "}
                                    {selectedOrder.quantity}
                                </div>
                                <div>
                                    <span className="font-medium">Phone:</span>{" "}
                                    {selectedOrder.phone}
                                </div>
                                <div className="sm:col-span-2">
                                    <span className="font-medium">Shipping Address:</span>{" "}
                                    {selectedOrder.shippingAddress}
                                </div>
                                <div className="sm:col-span-2">
                                    <span className="font-medium">Sender:</span>{" "}
                                    {selectedOrder.senderName}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                                        Order Type *
                                    </label>
                                    <select
                                        value={orderWeight}
                                        onChange={(e) =>
                                            setOrderWeight(e.target.value as "light" | "heavy")
                                        }
                                        className="h-12 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                    >
                                        <option value="light">Light Order</option>
                                        <option value="heavy">Heavy Order</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                                        Required Note *
                                    </label>
                                    <select
                                        value={requiredNote}
                                        onChange={(e) => setRequiredNote(e.target.value)}
                                        className="h-12 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                    >
                                        <option value="CHOTHUHANG">Allow Try On</option>
                                        <option value="CHOXEMHANGKHONGTHU">Inspect Without Try</option>
                                        <option value="KHONGCHOXEMHANG">No Inspection</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                                        Service Type *
                                    </label>
                                    <select
                                        value={serviceTypeId}
                                        onChange={(e) =>
                                            setServiceTypeId(Number(e.target.value))
                                        }
                                        className="h-12 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                    >
                                        <option value={1}>Air</option>
                                        <option value={2}>Ground</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                                        Payment By *
                                    </label>
                                    <select
                                        value={paymentTypeId}
                                        onChange={(e) =>
                                            setPaymentTypeId(Number(e.target.value))
                                        }
                                        className="h-12 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                    >
                                        <option value={1}>Sender</option>
                                        <option value={2}>Receiver</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                                    Additional Note
                                </label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    rows={4}
                                    placeholder="E.g., deliver in the morning, call before delivery..."
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="h-12 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                                >
                                    <i className="pi pi-times mr-2" /> Cancel
                                </button>
                                <button
                                    onClick={handleConfirmOrder}
                                    className="h-12 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-md hover:bg-blue-700"
                                >
                                    <i className="pi pi-check mr-2" /> Confirm
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}