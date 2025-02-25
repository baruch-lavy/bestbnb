import { useState, useEffect, useRef } from "react";
import { orderService } from "../services/order";
import { showErrorMsg } from "../services/event-bus.service";
import { Loading } from "../cmps/Loading";
import { io } from "socket.io-client";
import { userService } from "../services/user";
import { OrderStatusModal } from "../cmps/OrderStatusModal";

const socket = io("http://localhost:3030", { transports: ["websocket"] }); // ✅ Ensure WebSocket connection

export function Trips() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusModal, setStatusModal] = useState(null);
    const hasSocketListener = useRef(false);
    const loggedinUserRef = useRef(null);
    const previousOrdersRef = useRef(null);

    useEffect(() => {
        const user = userService.getLoggedinUser();
        if (user) {
            loggedinUserRef.current = user;
            console.log("🔵 Logged-in user:", user);
            loadOrders(); // ✅ Load orders as soon as user is set
            setupWebSocket(user._id); // ✅ Setup WebSocket listener
        }
        // בדיקה כל 5 שניות לשינויים
        const interval = setInterval(checkForUpdates, 5000);
        return () => {
            clearInterval(interval);
            socket.emit("unset-user-socket");
            socket.off(`orderUpdated-${user._id}`);
            hasSocketListener.current = false;
        };
    }, []);

    function setupWebSocket(userId) {
        if (hasSocketListener.current) return;
        hasSocketListener.current = true;

        console.log("🛜 Registering WebSocket for user:", userId);
        socket.emit("set-user-socket", userId); // ✅ Tell backend who the user is

        // ✅ Listen for order updates in real-time
        socket.on(`orderUpdated-${userId}`, (updatedOrder) => {
            console.log("🔄 Trip order updated in real-time:", updatedOrder);
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === updatedOrder._id ? updatedOrder : order
                )
            );
        });
    }

    async function loadOrders() {
        try {
            const orders = await orderService.getOrdersByBuyer();
            setOrders(orders);
            previousOrdersRef.current = orders;
        } catch (err) {
            console.error("Failed to load orders:", err);
            showErrorMsg("Failed to load orders");
        } finally {
            setIsLoading(false);
        }
    }

    async function checkForUpdates() {
        try {
            const currentOrders = await orderService.getOrdersByBuyer();
            
            // בדיקה אם יש שינוי בסטטוס של הזמנה
            currentOrders.forEach(currentOrder => {
                const previousOrder = previousOrdersRef.current?.find(
                    order => order._id === currentOrder._id
                );
                
                if (previousOrder && previousOrder.status !== currentOrder.status) {
                    // מצאנו שינוי! נציג מודל
                    setStatusModal(currentOrder);
                    setOrders(currentOrders);
                }
            });
            
            previousOrdersRef.current = currentOrders;
        } catch (err) {
            console.error("Failed to check for updates:", err);
        }
    }

    async function onRemoveOrder(orderId) {
        try {
            await orderService.updateOrderStatus(orderId, "cancelled");
            setOrders(
                orders.map((order) =>
                    order._id === orderId ? { ...order, status: "cancelled" } : order
                )
            );
        } catch (err) {
            console.error("Failed to cancel order:", err);
            showErrorMsg("Failed to cancel order");
        }
    }

    if (isLoading) return <Loading />;

    if (!orders.length)
        return <div className="no-trips">No trips booked yet</div>;

    return (
        <section className="trips-page">
            <h1>Trips & Stays</h1>

            <div className="orders-table">
                <table>
                    <thead>
                        <tr>
                            <th>Stay</th>
                            <th>Dates</th>
                            <th>Guests</th>
                            <th>Total Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.slice().reverse().map((order) => (
                            <tr key={order._id}>
                                <td>
                                    <div className="stay-info">
                                        <img
                                            src={order.stay.imgUrl || "/img/stays/default.jpg"}
                                            alt={order.stay.name}
                                        />
                                        <div>
                                            <h3>{order.stay.name}</h3>
                                            <p>
                                                {order.stay.city || ""}, {order.stay.country || ""}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    {order.startDate} - {order.endDate}
                                </td>
                                <td>
                                    {(order.guests?.adults || 0) + (order.guests?.children || 0)}{" "}
                                    guests
                                </td>
                                <td>${order.totalPrice}</td>
                                <td>
                                    <span className={`status ${order.status}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="cancel-btn"
                                        onClick={() => onRemoveOrder(order._id)}
                                        disabled={order.status === "cancelled"}
                                    >
                                        {order.status === "cancelled"
                                            ? "Cancelled"
                                            : "Cancel Order"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {statusModal && (
                <OrderStatusModal 
                    order={statusModal} 
                    onClose={() => setStatusModal(null)} 
                />
            )}
        </section>
    );
}
