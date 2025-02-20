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
    getOrderStats,
    getOrderStats,
    getOrdersByBuyer
}

async function query(filterBy = {}) {
    try {
        let orders = await storageService.query(STORAGE_KEY)
        if (!orders || !orders.length) {
            orders = _createOrders()
        }

        orders = orders.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
        
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
        order._id = _makeId()
        if (!order.status) order.status = 'pending'
        if (!order.msgs) order.msgs = []
        
        const orders = await storageService.query(STORAGE_KEY)
        orders.unshift(order)
        storageService.saveToStorage(STORAGE_KEY, orders)
        return order
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
            _id: 'ord_456821',
            hostId: { _id: 'u103', fullname: "Alice", imgUrl: "..." },
            guest: {
                _id: 'u106',
                fullname: 'David Smith',
            },
            totalPrice: 238,
            startDate: 'Feb 15',
            endDate: 'Mar 01',
            guests: {
                adults: 2,
                kids: 1,
            },
            stay: {
                _id: 'h107',
                name: 'Fresh and modern 1BR in Bed-Stuy',
                price: 110.0,
            },
            msgs: [],
            status: 'pending',
        },
    ]
    storageService.saveToStorage(STORAGE_KEY, orders)
    return orders
}

function _makeId() {
    const prefix = 'ord_'
    const timestamp = new Date().getTime().toString().slice(-4)
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `${prefix}${timestamp}${randomNum}`
}

async function getOrdersByBuyer() {
    try {
        const orders = await query()
        return orders.filter(order => order.guest._id === 'u101') 
    } catch (err) {
        console.error('Failed to get buyer orders:', err)
        throw err
    }
}