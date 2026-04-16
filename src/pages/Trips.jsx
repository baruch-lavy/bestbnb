import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { orderService } from "../services/order"
import { showErrorMsg } from "../services/event-bus.service"
import { Loading } from "../cmps/Loading"
import { store } from '../store/store'
import { socketService , SOCKET_EVENT_ORDER_UPDATED } from '../services/socket.service'
import { userService } from "../services/user"

export function Trips() {
    const [orders, setOrders] = useState([])
    const [wishlist, setWishlist] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const hasSocketListener = useRef(false)
    const loggedinUserRef = useRef(null)
    const previousOrdersRef = useRef(null)

    useEffect(() => {
        window.scrollTo(0, 0)
        const user = userService.getLoggedinUser()
        if (user) {
            loggedinUserRef.current = user
            loadOrders()
            loadWishlist()
            socketService.emit("set-user-socket", user._id)
            socketService.on(SOCKET_EVENT_ORDER_UPDATED, onOrderUpdate)
        }
      
        return () => {
            socketService.off(SOCKET_EVENT_ORDER_UPDATED, onOrderUpdate)
            hasSocketListener.current = false
        }
    }, [])

    function onOrderUpdate(order) {
        store.dispatch({ type: 'SET_ORDER', order})
        loadOrders()
    }

    async function loadOrders() {
        try {
            const orders = await orderService.getOrdersByBuyer()
            setOrders(orders)
            previousOrdersRef.current = orders
        } catch (err) {
            console.error("Failed to load orders:", err)
            showErrorMsg("Failed to load orders")
        } finally {
            setIsLoading(false)
        }
    }

    async function loadWishlist() {
        try {
            const stays = await userService.getWishlist()
            setWishlist(stays)
        } catch (err) {
            console.error("Failed to load wishlist:", err)
        }
    }

    async function onRemoveOrder(orderId) {
        try {
            await orderService.updateOrderStatus(orderId, "cancelled")
            setOrders(
                orders.map((order) =>
                    order._id === orderId ? { ...order, status: "cancelled" } : order
                )
            )
        } catch (err) {
            console.error("Failed to cancel order:", err)
            showErrorMsg("Failed to cancel order")
        }
    }

    async function onRemoveFromWishlist(stayId) {
        try {
            await userService.removeFromWishlist(stayId)
            setWishlist(wishlist.filter(stay => String(stay._id) !== String(stayId)))
        } catch (err) {
            console.error("Failed to remove from wishlist:", err)
            showErrorMsg("Failed to remove from wishlist")
        }
    }

    if (isLoading) return <Loading />

    return (
        <section className="trips-page">
            <h1>Trips & Stays</h1>

            {orders.length === 0 ? (
                <div className="no-trips">No trips booked yet</div>
            ) : (
                <div className="orders-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Stay</th>
                                <th>Dates</th>
                                <th>Guests</th>
                                <th>Total Price</th>
                                <th>Status</th>
                                <th className="actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.slice().reverse().map((order) => (
                                <tr key={order._id}>
                                    <td className="stay-cell" data-label="Stay">
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
                                    <td data-label="Dates">
                                        {order.startDate} - {order.endDate}
                                    </td>
                                    <td data-label="Guests">
                                        {(order.guests?.adults || 0) + (order.guests?.children || 0)}{" "}
                                        guests
                                    </td>
                                    <td data-label="Total Price">${order.totalPrice}</td>
                                    <td data-label="Status">
                                        <span className={`status ${order.status}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="actions" data-label="Actions">
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
            )}

            <div className="wishlist-section">
                <h2>Wish List</h2>
                {wishlist.length === 0 ? (
                    <p className="no-wishlist">No saved stays yet</p>
                ) : (
                    <div className="wishlist-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Stay</th>
                                    <th>Location</th>
                                    <th>Price / night</th>
                                    <th className="actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {wishlist.map((stay) => (
                                    <tr key={stay._id}>
                                        <td className="stay-cell" data-label="Stay">
                                            <Link to={`/stay/${stay._id}`} className="stay-info">
                                                <img
                                                    src={stay.imgUrls?.[0] || "/img/stays/default.jpg"}
                                                    alt={stay.name}
                                                />
                                                <h3>{stay.name}</h3>
                                            </Link>
                                        </td>
                                        <td data-label="Location">
                                            {stay.loc?.city || ""}, {stay.loc?.country || ""}
                                        </td>
                                        <td data-label="Price / night">${stay.price}</td>
                                        <td className="actions" data-label="Actions">
                                            <button
                                                className="cancel-btn"
                                                onClick={() => onRemoveFromWishlist(stay._id)}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    )
}