
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


async function query(filterBy = { txt: '', minPrice: 0, maxPrice: Infinity, destination: '', guests: 1, startDate: null, endDate: null }) {
    var stays = await storageService.query(STORAGE_KEY);
    console.log("🚀 ~ file: stay.service.local.js ~ line 19 ~ query ~ stays", stays);

    const { txt, minPrice, maxPrice, destination, guests, startDate, endDate } = filterBy;

    if (!stays || stays.length === 0) return [];

    // ✅ Destination Filtering (Fix: use `loc.country` instead of `location`)
    if (destination) {
        const regex = new RegExp(destination, 'i');
        stays = stays.filter(stay => regex.test(stay.loc?.country || '') || regex.test(stay.name));
    }

    // ✅ Text Filtering (Fix: Check Name & Description)
    if (txt) {
        const regex = new RegExp(txt, 'i');
        stays = stays.filter(stay => regex.test(stay.name));
    }

    // ✅ Price Filtering
    stays = stays.filter(stay => stay.price >= minPrice && stay.price <= maxPrice);

    // ✅ Guest Filtering (Fix: Check `capacity` field if available)
    if (guests) {
        stays = stays.filter(stay => stay.capacity >= guests);
    }

    // ✅ FIXED: Date Filtering (Convert `dates` string to actual dates)
    if (startDate && endDate) {
        const searchStart = new Date(startDate).getTime();
        const searchEnd = new Date(endDate).getTime();

        stays = stays.filter(stay => {
            if (!stay.dates) return true; // ✅ Keep stays without date info

            const [startStr, endStr] = stay.dates.split(" - "); // ✅ Extract the start and end from "Feb 25 - Mar 2"
            const stayStart = new Date(`${startStr} 2024`).getTime(); // ✅ Convert to timestamp
            const stayEnd = new Date(`${endStr} 2024`).getTime();

            return searchStart >= stayStart && searchEnd <= stayEnd;
        });
    }

    console.log("🚀 ~ file: stay.service.local.js ~ query() returning stays:", stays);
    return stays;
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