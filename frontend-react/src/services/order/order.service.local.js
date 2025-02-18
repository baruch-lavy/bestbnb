
import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'order'
_createOrders()

export const orderService = {
    query,
    getById,
    save,
    remove,
    addOrderMsg
}
window.cs = orderService


async function query(filterBy = { txt: '', price: 0 }) {
    var orders = await storageService.query(STORAGE_KEY)
    // const { txt, minSpeed, maxPrice, sortField, sortDir } = filterBy

    // if (txt) {
    //     const regex = new RegExp(filterBy.txt, 'i')
    //     orders = orders.filter(order => regex.test(order.vendor) || regex.test(order.description))
    // }
    // if (minSpeed) {
    //     orders = orders.filter(order => order.speed >= minSpeed)
    // }
    // if (sortField === 'vendor' || sortField === 'owner') {
    //     orders.sort((order1, order2) =>
    //         order1[sortField].localeCompare(order2[sortField]) * +sortDir)
    // }
    // if (sortField === 'price' || sortField === 'speed') {
    //     orders.sort((order1, order2) =>
    //         (order1[sortField] - order2[sortField]) * +sortDir)
    // }

    orders = orders.map(({ _id, vendor, price, speed, owner }) => ({ _id, vendor, price, speed, owner }))
    return orders
}

function getById(orderId) {
    return storageService.get(STORAGE_KEY, orderId)
}

async function remove(orderId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, orderId)
}

async function save(order) {
    var savedOrder
    if (order._id) {
        const orderToSave = {
            _id: order._id,
            price: order.price,
            speed: order.speed,
        }
        savedOrder = await storageService.put(STORAGE_KEY, orderToSave)
    } else {
        const orderToSave = {
            vendor: order.vendor,
            price: order.price,
            speed: order.speed,
            // Later, owner is set by the backend
            owner: userService.getLoggedinUser(),
            msgs: []
        }
        savedOrder = await storageService.post(STORAGE_KEY, orderToSave)
    }
    return savedOrder
}

async function addOrderMsg(orderId, txt) {
    // Later, this is all done by the backend
    const order = await getById(orderId)

    const msg = {
        id: makeId(),
        by: userService.getLoggedinUser(),
        txt
    }
    order.msgs.push(msg)
    await storageService.put(STORAGE_KEY, order)

    return msg
}

function _createOrders() {
    let orders = storageService.loadFromStorage(STORAGE_KEY)
    if (!orders || !orders.length) {
        let orders = [
            {
                _id: 'o1225',
                hostId: { _id: 'u102', fullname: "bob", imgUrl: "..." },
                guest: {
                    _id: 'u101',
                    fullname: 'User 1',
                },
                totalPrice: 160,
                startDate: '2025/10/15',
                endDate: '2025/10/17',
                guests: {
                    adults: 1,
                    kids: 2,
                },
                stay: {
                    // mini-stay
                    _id: 'h102',
                    name: 'House Of Uncle My',
                    price: 80.0,
                },
                msgs: [], // host - guest chat
                status: 'pending', // approved / rejected
            },
        ]
        console.log(orders)
        storageService.saveToStorage(STORAGE_KEY, orders)
    }
}