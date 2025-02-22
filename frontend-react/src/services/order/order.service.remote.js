import { httpService } from '../http.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const orderService = {
    query,
    getById,
    save,
    remove,
    addOrderMsg,
    getOrdersByBuyer
}

async function query(filterBy = { txt: '', price: 0 }) {
    return httpService.get(`order`, filterBy)
}

function getById(orderId) {
    return httpService.get(`order/${orderId}`)
}

function getOrdersByBuyer() {
    try {
        const user = JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
        if (!user || !user._id) throw new Error("User not found")

        // ✅ Use httpService instead of fetch
        return httpService.get(`order/user/${user._id}`)
    } catch (err) {
        console.error("Error fetching orders:", err)
        throw err
    }
}



async function remove(orderId) {
    return httpService.delete(`order/${orderId}`)
}
async function save(order) {
    console.log('order', order)
    var savedOrder
    if (order._id) {
        savedOrder = await httpService.put(`order/${order._id}`, order)
    } else {
        savedOrder = await httpService.post('order', order)
    }
    return savedOrder
}

async function addOrderMsg(orderId, txt) {
    const savedMsg = await httpService.post(`order/${orderId}/msg`, {txt})
    return savedMsg
}