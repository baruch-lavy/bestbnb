import { useState, useEffect, useRef } from "react";
import { orderService } from "../services/order";
import { showErrorMsg } from "../services/event-bus.service";
import { Loading } from "../cmps/Loading";
import { io } from "socket.io-client";
import { userService } from "../services/user";

const socket = io("http://localhost:3030", { transports: ["websocket"] }); // ✅ Ensure WebSocket connection

export function Trips() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const hasSocketListener = useRef(false);
    const loggedinUserRef = useRef(null);

    useEffect(() => {
        const user = userService.getLoggedinUser();
        if (user) {
            loggedinUserRef.current = user;
            console.log("🔵 Logged-in user:", user);
            loadOrders(); // ✅ Load orders as soon as user is set
            setupWebSocket(user._id); // ✅ Setup WebSocket listener
        }
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

        // ✅ Cleanup WebSocket listener when component unmounts
        return () => {
            socket.emit("unset-user-socket");
            socket.off(`orderUpdated-${userId}`);
            hasSocketListener.current = false;
        };
    }

  async function loadOrders() {
    try {
      const orders = await orderService.getOrdersByBuyer();
      setOrders(orders);
    } catch (err) {
      console.error("Failed to load orders:", err);
      showErrorMsg("Failed to load orders");
    } finally {
      setIsLoading(false);
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
    </section>
  );
}
