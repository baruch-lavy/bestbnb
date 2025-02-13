
import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'stay'
_createStays()

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
    
    stays = stays.map
    (({
        _id,
        name,
        loc,
        imgUrls,
        price,
        reviews,
        distance,
        dates,
        type,
        bedrooms,
        beds,
        baths,
        summary,
        capacity,
        amenities,
        labels,
        host,
        likedByUsers }) =>
            
        ({  _id,
            name,
            loc,
            imgUrls,
            price,
            reviews,
            distance,
            dates,
            type,
            bedrooms,
            beds,
            baths,
            summary,
            capacity,
            amenities,
            labels,
            host,
            likedByUsers }))

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

function _createStays() {
    let stays = storageService.loadFromStorage(STORAGE_KEY)
    if (!stays || !stays.length) {
        let stays = [
            {
                _id: 's101',
                name: 'Ponta Delgada',
                loc: {
                    country: 'Portugal',
                    city: 'Ponta Delgada',
                    address: 'Windmill St. 123',
                },
                imgUrls: ['https://loremflickr.com/200/200?random=1',
                    'https://loremflickr.com/200/200?random=2',
                    'https://loremflickr.com/200/200?random=3',
                    'https://loremflickr.com/200/200?random=4',
                    'https://loremflickr.com/200/200?random=5',
                    'https://loremflickr.com/200/200?random=6',],
                price: 659,
                reviews: [
                   { 
                      id: 'madeId1',
                      txt: 'Very helpful hosts. Cooked traditional local dishes and made our stay memorable.',
                      rate: 4.92,
                      by: {
                        _id: 'u102',
                        fullname: 'user2',
                        imgUrl: 'https://loremflickr.com/200/200?random=7',
                      },
                    },
                    {
                      id: 'madeId2',
                      txt: 'The apartment was spotless, and the location was perfect for exploring the city.',
                      rate: 4.85,
                      by: {
                        _id: 'u103',
                        fullname: 'user3',
                        imgUrl: 'https://loremflickr.com/200/200?random=8',
                      },
                    },
                    {
                      id: 'madeId3',
                      txt: 'Amazing stay! The host was friendly and gave us great recommendations for places to visit.',
                      rate: 4.75,
                      by: {
                        _id: 'u104',
                        fullname: 'user4',
                        imgUrl: 'https://loremflickr.com/200/200?random=9',
                      },
                    },
                    {
                      id: 'madeId4',
                      txt: 'Great hosts, and the apartment exceeded our expectations. Highly recommended!',
                      rate: 5.0,
                      by: {
                        _id: 'u105',
                        fullname: 'user5',
                        imgUrl: 'https://loremflickr.com/200/200?random=10',
                      },
                    },
                  ],
                distance: '5,462 kilometers away',
                dates: 'Feb 25 - Mar 2',
                type: 'House',
                bedrooms : 3,
                beds : 2,
                baths : 1,
                summary: 'Have fun with the whole family in this newly renovated stylish accommodation and a fantastic pool to enjoy the tranquility and views from this privileged enclave at the foot of Montjuic! \n The space \n Welcome to the perfect apartment to rent with a privileged... \n Show more > ',
                capacity: 8,
                amenities: ['TV', 'Wifi', 'Kitchen', 'Smoking allowed', 'Pets allowed', 'Cooking basics'],
                labels: ['Top of the world', 'Trending', 'Play', 'Tropical'],
                host: {
                    _id: 'u101',
                    fullname: 'Davit Pok',
                    imgUrl: 'https://loremflickr.com/200/200?random=11',
                    yearsHosting: 4,
                },
                likedByUsers: [],
            },
            {
                _id: 's102',
                name: 'Western Cape',
                loc: {
                    country: 'South Africa',
                    city: 'Western Cape',
                    address: 'Farm Road 42',
                },
                imgUrls: ['/img/stays/airstream.jpg'],
                price: 447,
                reviews: [{ rate: 4.94 }],
                distance: '7,470 kilometers away',
                dates: 'Mar 23 - 28',
                type: 'House',
                summary: 'Fantastic duplex apartment...',
                capacity: 8,
                amenities: ['TV', 'Wifi', 'Kitchen', 'Smoking allowed', 'Pets allowed', 'Cooking basics'],
                labels: ['Top of the world', 'Trending', 'Play', 'Tropical'],
                host: {
                },
                likedByUsers: [],
            },
            {
                _id: 's103',
                name: 'Sindun-myeon, Icheon-si',
                loc: {
                    country: 'South Korea',
                    city: 'Sindun-myeon, Icheon-si',
                    address: 'Music Valley 55',
                },
                imgUrls: ['/img/stays/guitar-house.jpg'],
                price: 265,
                reviews: [{ rate: 4.84 }],
                distance: '8,127 kilometers away',
                dates: 'Feb 16 - 21',
                type: 'House',
                summary: 'Fantastic duplex apartment...',
                capacity: 8,
                amenities: ['TV', 'Wifi', 'Kitchen', 'Smoking allowed', 'Pets allowed', 'Cooking basics'],
                labels: ['Top of the world', 'Trending', 'Play', 'Tropical'],
                host: {
                },
                likedByUsers: [],
            },
            {
                _id: 's104',
                name: 'Brälanda',
                loc: {
                    country: 'Sweden',
                    city: 'Brälanda',
                    address: 'Nature View 78',
                },
                imgUrls: ['/img/stays/glass-house.jpg'],
                price: 1663,
                reviews: [{ rate: 4.97 }],
                distance: '3,383 kilometers away',
                dates: 'Mar 12 - 17',
                type: 'House',
                summary: 'Fantastic duplex apartment...',
                capacity: 8,
                amenities: ['TV', 'Wifi', 'Kitchen', 'Smoking allowed', 'Pets allowed', 'Cooking basics'],
                labels: ['Top of the world', 'Trending', 'Play', 'Tropical'],
                host: {
                },
                likedByUsers: [],
            },
            {
                _id: 's105',
                name: 'Stege',
                loc: {
                    country: 'Denmark',
                    city: 'Stege',
                    address: 'Forest Path 90',
                },
                imgUrls: ['/img/stays/modern-cabin.jpg'],
                price: 999,
                reviews: [{ rate: 5.0 }],
                distance: '3,091 kilometers away',
                dates: 'Mar 29 - Apr 3',
                type: 'House',
                summary: 'Fantastic duplex apartment...',
                capacity: 8,
                amenities: ['TV', 'Wifi', 'Kitchen', 'Smoking allowed', 'Pets allowed', 'Cooking basics'],
                labels: ['Top of the world', 'Trending', 'Play', 'Tropical'],
                host: {
                },
                likedByUsers: [],
            }
        ] 
    console.log(stays)
    storageService.saveToStorage(STORAGE_KEY, stays)
    }
}