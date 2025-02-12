
import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'stay'

export const stayService = {
    query,
    getById,
    save,
    remove,
    addStayMsg
}
window.cs = stayService


async function query(filterBy = { txt: '', price: 0 }) {
    var stays = await storageService.query(STORAGE_KEY)
    const { txt, minPrice, maxPrice, sortField, sortDir } = filterBy

    if (txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        stays = stays.filter(stay => regex.test(stay.name) || regex.test(stay.description))
    }
    if (minPrice) {
        stays = stays.filter(stay => stay.price >= minPrice)
    }
    if(sortField === 'name' || sortField === 'host'){
        stays.sort((stay1, stay2) => 
            stay1[sortField].localeCompare(stay2[sortField]) * +sortDir)
    }
    if(sortField === 'price'){
        stays.sort((stay1, stay2) => 
            (stay1[sortField] - stay2[sortField]) * +sortDir)
    }
    
    stays = stays.map(({ _id, name, price, host }) => ({ _id, name,  price, host }))
    return stays
}

function getById(stayId) {
    return storageService.get(STORAGE_KEY, stayId)
}

async function remove(stayId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, stayId)
}

async function save(stay) {
    var savedStay
    if (stay._id) {
        const stayToSave = {
            _id: stay._id,
            name: stay.name,
            price: stay.price,
            type : stay.type,
            imgUrls : stay.imgUrls,
            summary : stay.summary,
            capacity : stay.capacity,
            amenities : stay.amenities,
            labels : stay.labels,
            // Later, host is set by the backend
            host : userService.getLoggedinUser(),
            // loc : stay.loc,
            // reviews : stay.reviews,
            // likedByUsers: stay.likedByUsers,
            // msgs: []
        }
        savedStay = await storageService.put(STORAGE_KEY, stayToSave)
    } else {
        const stayToSave = {
            name: stay.name,
            price: stay.price,
            type : stay.type,
            imgUrls : stay.imgUrls,
            summary : stay.summary,
            capacity : stay.capacity,
            amenities : stay.amenities,
            labels : stay.labels,
            // Later, host is set by the backend
            host : userService.getLoggedinUser(),
            // loc : stay.loc,
            // reviews : stay.reviews,
            // likedByUsers: stay.likedByUsers,
            // msgs: []
        }
        savedStay = await storageService.post(STORAGE_KEY, stayToSave)
    }
    return savedStay
}

async function addStayMsg(stayId, txt) {
    // Later, this is all done by the backend
    const stay = await getById(stayId)

    const msg = {
        id: makeId(),
        by: userService.getLoggedinUser(),
        txt
    }
    stay.msgs.push(msg)
    await storageService.put(STORAGE_KEY, stay)

    return msg
}