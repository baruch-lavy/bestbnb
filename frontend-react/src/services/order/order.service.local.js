import { storageService } from '../async-storage.service'
import { userService } from '../user.service.js'

const STORAGE_KEY = 'order'

export const orderService = {
    query,
    getById,
    save,
    remove,
    addOrderMsg,
    updateOrderStatus,
    getOrderStats
}

async function query(filterBy = {}) {
    try {
        let orders = await storageService.query(STORAGE_KEY)
        if (!orders || !orders.length) {
            orders = _createOrders()
        }
        if (filterBy.hostId) {
            orders = orders.filter(order => order.hostId._id === filterBy.hostId)
        }
        return orders
    } catch (err) {
        console.error('Failed to get orders:', err)
        throw err
    }
}

async function getById(orderId) {
    return storageService.get(STORAGE_KEY, orderId)
}

async function remove(orderId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, orderId)
}

async function save(order) {
    if (order._id) {
        return storageService.put(STORAGE_KEY, order)
    } else {
        // כשיוצרים הזמנה חדשה
        order._id = _makeId()
        if (!order.status) order.status = 'pending'
        if (!order.msgs) order.msgs = []
        return storageService.post(STORAGE_KEY, order)
    }
}

async function addOrderMsg(orderId, txt) {
    // Later, this is all done by the backend
    const order = await getById(orderId)

    const msg = {
        id: _makeId(),
        by: userService.getLoggedinUser(),
        txt
    }
    order.msgs.push(msg)
    await storageService.put(STORAGE_KEY, order)

    return msg
}

async function getOrderStats() {
    const orders = await query()
    return {
        totalSales: orders.reduce((acc, order) => acc + order.totalPrice, 0),
        totalCustomers: new Set(orders.map(order => order.guest._id)).size,
        refundedCount: orders.filter(order => order.status === 'rejected').length,
        averageRevenue: orders.length ? orders.reduce((acc, order) => acc + order.totalPrice, 0) / orders.length : 0
    }
}

async function updateOrderStatus(orderId, status) {
    const order = await getById(orderId)
    order.status = status
    return storageService.put(STORAGE_KEY, order)
}

function _createOrders() {
    const orders = [
        {
            _id: 'o1230',
            hostId: { _id: 'u103', fullname: "Alice", imgUrl: "..." },
            guest: {
                _id: 'u106',
                fullname: 'David Smith',
            },
            totalPrice: 220,
            startDate: '2025/11/05',
            endDate: '2025/11/08',
            guests: {
                adults: 2,
                kids: 1,
            },
            stay: {
                _id: 'h107',
                name: 'Seaside Villa',
                price: 110.0,
            },
            msgs: [],
            status: 'confirmed',
        },
        {
            _id: 'o1231',
            hostId: { _id: 'u104', fullname: "Charlie", imgUrl: "..." },
            guest: {
                _id: 'u107',
                fullname: 'Emma Johnson',
            },
            totalPrice: 300,
            startDate: '2025/12/20',
            endDate: '2025/12/25',
            guests: {
                adults: 3,
                kids: 2,
            },
            stay: {
                _id: 'h108',
                name: 'Mountain Retreat',
                price: 100.0,
            },
            msgs: [],
            status: 'pending',
        },
        {
            _id: 'o1232',
            hostId: { _id: 'u105', fullname: "Daniel", imgUrl: "..." },
            guest: {
                _id: 'u108',
                fullname: 'Sophia Lee',
            },
            totalPrice: 180,
            startDate: '2025/09/10',
            endDate: '2025/09/12',
            guests: {
                adults: 2,
                kids: 0,
            },
            stay: {
                _id: 'h109',
                name: 'Downtown Apartment',
                price: 90.0,
            },
            msgs: [],
            status: 'cancelled',
        },
        {
            _id: 'o1233',
            hostId: { _id: 'u106', fullname: "Ethan", imgUrl: "..." },
            guest: {
                _id: 'u109',
                fullname: 'Liam Brown',
            },
            totalPrice: 400,
            startDate: '2025/08/15',
            endDate: '2025/08/20',
            guests: {
                adults: 4,
                kids: 1,
            },
            stay: {
                _id: 'h110',
                name: 'Luxury Penthouse',
                price: 200.0,
            },
            msgs: [],
            status: 'confirmed',
        },
        {
            _id: 'o1234',
            hostId: { _id: 'u107', fullname: "Sophia", imgUrl: "..." },
            guest: {
                _id: 'u110',
                fullname: 'Olivia Wilson',
            },
            totalPrice: 150,
            startDate: '2025/07/22',
            endDate: '2025/07/24',
            guests: {
                adults: 1,
                kids: 1,
            },
            stay: {
                _id: 'h111',
                name: 'Cozy Cottage',
                price: 75.0,
            },
            msgs: [],
            status: 'pending',
        }
        
    ]
    storageService.saveToStorage(STORAGE_KEY, orders)
    return orders
}

function _makeId(length = 5) {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}