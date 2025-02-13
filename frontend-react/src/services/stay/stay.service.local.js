import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'stay'
_createStays()

const categoryMapping = {
    'OMG!': ['Luxury', 'Exclusive'],
    'Icons': ['Modern', 'Urban'],
    'Castles': ['Villa', 'Mansion'],
    'Beachfront': ['Beachfront', 'Seaview'],
    'Cabins': ['Cabin', 'Cottage'],
    // ... add more mappings
}

export const stayService = {
    query,
    getById,
    save,
    remove,
    addStayMsg
}
window.cs = stayService


async function query(filterBy = { txt: '', price: 0, type: '' }) {
    var stays = await storageService.query(STORAGE_KEY)
    const { txt, minPrice, maxPrice, sortField, sortDir, type } = filterBy

    if (txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        stays = stays.filter(stay => regex.test(stay.name) || regex.test(stay.description))
    }
    if (minPrice) {
        stays = stays.filter(stay => stay.price >= minPrice)
    }
    if (sortField === 'name' || sortField === 'host') {
        stays.sort((stay1, stay2) =>
            stay1[sortField].localeCompare(stay2[sortField]) * +sortDir)
    }
    if (sortField === 'price') {
        stays.sort((stay1, stay2) =>
            (stay1[sortField] - stay2[sortField]) * +sortDir)
    }

    if (type) {
        stays = stays.filter(stay => {
            return (
                stay.type === type ||
                stay.labels.includes(type) ||
                stay.amenities.includes(type)
            )
        })
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

        ({
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
            likedByUsers
        }))

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
            type: stay.type,
            imgUrls: stay.imgUrls,
            summary: stay.summary,
            capacity: stay.capacity,
            amenities: stay.amenities,
            labels: stay.labels,
            // Later, host is set by the backend
            host: userService.getLoggedinUser(),
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
            type: stay.type,
            imgUrls: stay.imgUrls,
            summary: stay.summary,
            capacity: stay.capacity,
            amenities: stay.amenities,
            labels: stay.labels,
            // Later, host is set by the backend
            host: userService.getLoggedinUser(),
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

                _id: 's102',
                name: 'Lisbon Retreat',
                loc: {
                    country: 'Portugal',
                    city: 'Lisbon',
                    address: 'Rua Nova do Carvalho 45',
                },
                imgUrls: [
                    'https://loremflickr.com/200/200?random=12',
                    'https://loremflickr.com/200/200?random=13',
                    'https://loremflickr.com/200/200?random=14',
                    'https://loremflickr.com/200/200?random=15',
                    'https://loremflickr.com/200/200?random=16',
                ],
                price: 720,
                reviews: [
                    {
                        id: 'review1',
                        txt: 'Beautiful view and great location!',
                        rate: 4.9,
                        by: {
                            _id: 'u106',
                            fullname: 'user6',
                            imgUrl: 'https://loremflickr.com/200/200?random=17',
                        },
                    },
                    {
                        id: 'review2',
                        txt: 'Spacious and modern, we had a fantastic stay.',
                        rate: 4.8,
                        by: {
                            _id: 'u107',
                            fullname: 'user7',
                            imgUrl: 'https://loremflickr.com/200/200?random=18',
                        },
                    },
                ],
                distance: '5,478 kilometers away',
                dates: 'Mar 12 - Mar 18',
                type: 'Apartment',
                bedrooms: 2,
                beds: 2,
                baths: 1,
                summary: 'Stay in a stylish apartment in the heart of Lisbon, close to amazing restaurants and cafes. ',
                capacity: 4,
                amenities: ['Air conditioning', 'Wifi', 'Kitchen', 'Washer', 'Balcony'],
                labels: ['City life', 'Cozy', 'Modern'],
                host: {
                    _id: 'u102',
                    fullname: 'Maria Lopes',
                    imgUrl: 'https://loremflickr.com/200/200?random=19',
                    yearsHosting: 5,
                },
                likedByUsers: [],
            },
            {
                _id: 's103',
                name: 'Seaside Escape',
                loc: {
                    country: 'Spain',
                    city: 'Barcelona',
                    address: 'Passeig de Gracia 78',
                },
                imgUrls: [
                    'https://loremflickr.com/200/200?random=20',
                    'https://loremflickr.com/200/200?random=21',
                    'https://loremflickr.com/200/200?random=22',
                    'https://loremflickr.com/200/200?random=23',
                ],
                price: 850,
                reviews: [
                    {
                        id: 'review3',
                        txt: 'Amazing ocean view, so peaceful!',
                        rate: 5.0,
                        by: {
                            _id: 'u108',
                            fullname: 'user8',
                            imgUrl: 'https://loremflickr.com/200/200?random=24',
                        },
                    },
                ],
                distance: '4,300 kilometers away',
                dates: 'Apr 5 - Apr 12',
                type: 'Villa',
                bedrooms: 4,
                beds: 3,
                baths: 2,
                summary: 'Experience the Mediterranean lifestyle in this stunning seaside villa. ',
                capacity: 6,
                amenities: ['TV', 'Pool', 'Kitchen', 'Beachfront'],
                labels: ['Seaview', 'Luxury', 'Private'],
                host: {
                    _id: 'u103',
                    fullname: 'Carlos Fernandez',
                    imgUrl: 'https://loremflickr.com/200/200?random=25',
                    yearsHosting: 6,
                },
                likedByUsers: [],
            },
            {
                _id: 's104',
                name: 'Mountain Retreat',
                loc: {
                    country: 'Switzerland',
                    city: 'Zermatt',
                    address: 'Matterhorn St. 9',
                },
                imgUrls: [
                    'https://loremflickr.com/200/200?random=26',
                    'https://loremflickr.com/200/200?random=27',
                    'https://loremflickr.com/200/200?random=28',
                ],
                price: 950,
                reviews: [
                    {
                        id: 'review4',
                        txt: 'Perfect place to relax and enjoy nature!',
                        rate: 4.95,
                        by: {
                            _id: 'u109',
                            fullname: 'user9',
                            imgUrl: 'https://loremflickr.com/200/200?random=29',
                        },
                    },
                ],
                distance: '6,200 kilometers away',
                dates: 'Jan 10 - Jan 17',
                type: 'Cabin',
                bedrooms: 3,
                beds: 3,
                baths: 2,
                summary: 'Cozy and warm wooden cabin with breathtaking mountain views. ',
                capacity: 5,
                amenities: ['Fireplace', 'Wifi', 'Sauna', 'Mountain view'],
                labels: ['Nature', 'Peaceful', 'Scenic'],
                host: {
                    _id: 'u104',
                    fullname: 'Anna Müller',
                    imgUrl: 'https://loremflickr.com/200/200?random=30',
                    yearsHosting: 7,
                },
                likedByUsers: [],
            },
            {
                _id: 's105',
                name: 'Countryside Getaway',
                loc: {
                    country: 'France',
                    city: 'Bordeaux',
                    address: 'Château St. 7',
                },
                imgUrls: [
                    'https://loremflickr.com/200/200?random=31',
                    'https://loremflickr.com/200/200?random=32',
                    'https://loremflickr.com/200/200?random=33',
                ],
                price: 780,
                reviews: [
                    {
                        id: 'review5',
                        txt: 'Loved the wine tasting experience!',
                        rate: 4.88,
                        by: {
                            _id: 'u110',
                            fullname: 'user10',
                            imgUrl: 'https://loremflickr.com/200/200?random=34',
                        },
                    },
                ],
                distance: '5,900 kilometers away',
                dates: 'May 15 - May 22',
                type: 'Cottage',
                bedrooms: 2,
                beds: 2,
                baths: 1,
                summary: 'A quiet cottage surrounded by vineyards, perfect for a relaxing stay. ',
                capacity: 4,
                amenities: ['Garden', 'Wifi', 'Kitchen', 'Pet-friendly'],
                labels: ['Rustic', 'Cozy', 'Nature'],
                host: {
                    _id: 'u105',
                    fullname: 'Jean Dupont',
                    imgUrl: 'https://loremflickr.com/200/200?random=35',
                    yearsHosting: 3,
                },
                likedByUsers: [],
            },
            {
                _id: 's106',
                name: 'Lakeview Serenity',
                loc: {
                    country: 'Canada',
                    city: 'Banff',
                    address: 'Lakefront Ave. 10',
                },
                imgUrls: [
                    'https://loremflickr.com/200/200?random=36',
                    'https://loremflickr.com/200/200?random=37',
                    'https://loremflickr.com/200/200?random=38',
                ],
                price: 820,
                reviews: [
                    {
                        id: 'review6',
                        txt: 'Breathtaking lake views, peaceful and quiet.',
                        rate: 4.9,
                        by: {
                            _id: 'u111',
                            fullname: 'user11',
                            imgUrl: 'https://loremflickr.com/200/200?random=39',
                        },
                    },
                ],
                distance: '7,200 kilometers away',
                dates: 'Jul 5 - Jul 12',
                type: 'Cabin',
                bedrooms: 3,
                beds: 2,
                baths: 1,
                summary: 'Stay in a charming cabin with a view of the beautiful Banff lakes. Perfect for a nature retreat! ',
                capacity: 5,
                amenities: ['Fireplace', 'Mountain view', 'Wifi', 'Kayak rental'],
                labels: ['Nature', 'Relaxing', 'Scenic'],
                host: {
                    _id: 'u106',
                    fullname: 'Jake Morrison',
                    imgUrl: 'https://loremflickr.com/200/200?random=40',
                    yearsHosting: 6,
                },
                likedByUsers: [],
            },
            {
                _id: 's107',
                name: 'Tokyo Sky Loft',
                loc: {
                    country: 'Japan',
                    city: 'Tokyo',
                    address: 'Shibuya Crossing 89',
                },
                imgUrls: [
                    'https://loremflickr.com/200/200?random=41',
                    'https://loremflickr.com/200/200?random=42',
                    'https://loremflickr.com/200/200?random=43',
                ],
                price: 950,
                reviews: [
                    {
                        id: 'review7',
                        txt: 'Amazing city views, and the place is spotless!',
                        rate: 5.0,
                        by: {
                            _id: 'u112',
                            fullname: 'user12',
                            imgUrl: 'https://loremflickr.com/200/200?random=44',
                        },
                    },
                ],
                distance: '9,500 kilometers away',
                dates: 'Aug 1 - Aug 7',
                type: 'Apartment',
                bedrooms: 1,
                beds: 1,
                baths: 1,
                summary: 'Experience Tokyo from a high-rise loft in the heart of Shibuya. Stunning skyline views! ',
                capacity: 2,
                amenities: ['Air conditioning', 'Smart TV', 'High-speed Wifi', 'Balcony'],
                labels: ['Urban', 'Modern', 'Luxury'],
                host: {
                    _id: 'u107',
                    fullname: 'Yuki Tanaka',
                    imgUrl: 'https://loremflickr.com/200/200?random=45',
                    yearsHosting: 3,
                },
                likedByUsers: [],
            },
            {
                _id: 's108',
                name: 'Santorini White Haven',
                loc: {
                    country: 'Greece',
                    city: 'Santorini',
                    address: 'Cliffside Rd. 22',
                },
                imgUrls: [
                    'https://loremflickr.com/200/200?random=46',
                    'https://loremflickr.com/200/200?random=47',
                    'https://loremflickr.com/200/200?random=48',
                ],
                price: 1050,
                reviews: [
                    {
                        id: 'review8',
                        txt: 'Breathtaking sunset views, and the infinity pool is a dream!',
                        rate: 5.0,
                        by: {
                            _id: 'u113',
                            fullname: 'user13',
                            imgUrl: 'https://loremflickr.com/200/200?random=49',
                        },
                    },
                ],
                distance: '8,000 kilometers away',
                dates: 'Sep 10 - Sep 16',
                type: 'Villa',
                bedrooms: 2,
                beds: 2,
                baths: 2,
                summary: 'A luxurious white-washed villa on the cliffs of Santorini, overlooking the Aegean Sea. ',
                capacity: 4,
                amenities: ['Infinity pool', 'Jacuzzi', 'Private terrace', 'Sunset view'],
                labels: ['Romantic', 'Luxury', 'Exclusive'],
                host: {
                    _id: 'u108',
                    fullname: 'Sophia Alexiou',
                    imgUrl: 'https://loremflickr.com/200/200?random=50',
                    yearsHosting: 8,
                },
                likedByUsers: [],
            },
            {
                _id: 's109',
                name: 'Marrakech Riad Retreat',
                loc: {
                    country: 'Morocco',
                    city: 'Marrakech',
                    address: 'Souk St. 77',
                },
                imgUrls: [
                    'https://loremflickr.com/200/200?random=51',
                    'https://loremflickr.com/200/200?random=52',
                    'https://loremflickr.com/200/200?random=53',
                ],
                price: 720,
                reviews: [
                    {
                        id: 'review9',
                        txt: 'Authentic and peaceful! Loved the courtyard and rooftop view.',
                        rate: 4.85,
                        by: {
                            _id: 'u114',
                            fullname: 'user14',
                            imgUrl: 'https://loremflickr.com/200/200?random=54',
                        },
                    },
                ],
                distance: '6,800 kilometers away',
                dates: 'Oct 5 - Oct 11',
                type: 'Riad',
                bedrooms: 3,
                beds: 3,
                baths: 2,
                summary: 'A traditional Moroccan riad with a beautiful courtyard and a rooftop lounge. ',
                capacity: 6,
                amenities: ['Private chef', 'Courtyard', 'Rooftop terrace', 'Tea service'],
                labels: ['Exotic', 'Traditional', 'Cultural'],
                host: {
                    _id: 'u109',
                    fullname: 'Omar El-Fassi',
                    imgUrl: 'https://loremflickr.com/200/200?random=55',
                    yearsHosting: 5,
                },
                likedByUsers: [],
            },
            {
                _id: 's110',
                name: 'Sydney Harbour View',
                loc: {
                    country: 'Australia',
                    city: 'Sydney',
                    address: 'Opera House Blvd. 5',
                },
                imgUrls: [
                    'https://loremflickr.com/200/200?random=56',
                    'https://loremflickr.com/200/200?random=57',
                    'https://loremflickr.com/200/200?random=58',
                ],
                price: 990,
                reviews: [
                    {
                        id: 'review10',
                        txt: 'Unbelievable harbour views, great location!',
                        rate: 4.95,
                        by: {
                            _id: 'u115',
                            fullname: 'user15',
                            imgUrl: 'https://loremflickr.com/200/200?random=59',
                        },
                    },
                ],
                distance: '12,000 kilometers away',
                dates: 'Nov 15 - Nov 22',
                type: 'Penthouse',
                bedrooms: 2,
                beds: 2,
                baths: 2,
                summary: 'A modern penthouse with spectacular views of Sydney Harbour and the Opera House. ',
                capacity: 4,
                amenities: ['Balcony', 'Floor-to-ceiling windows', 'Smart TV', 'Fully equipped kitchen'],
                labels: ['Luxury', 'Urban', 'Scenic'],
                host: {
                    _id: 'u110',
                    fullname: 'Emily Watson',
                    imgUrl: 'https://loremflickr.com/200/200?random=60',
                    yearsHosting: 7,
                },
                likedByUsers: [],
            },
            {
                _id: 's111',
                name: 'Parisian Elegance',
                loc: {
                    country: 'France',
                    city: 'Paris',
                    address: 'Champs-Élysées 24',
                },
                imgUrls: [
                    'https://loremflickr.com/200/200?random=61',
                    'https://loremflickr.com/200/200?random=62',
                    'https://loremflickr.com/200/200?random=63',
                ],
                price: 850,
                reviews: [
                    {
                        id: 'review11',
                        txt: 'A dreamy Parisian getaway with a fantastic view of the Eiffel Tower!',
                        rate: 4.9,
                        by: {
                            _id: 'u111',
                            fullname: 'user16',
                            imgUrl: 'https://loremflickr.com/200/200?random=64',
                        },
                    },
                ],
                distance: '5,400 kilometers away',
                dates: 'Oct 10 - Oct 17',
                type: 'Apartment',
                bedrooms: 2,
                beds: 2,
                baths: 1,
                summary: 'A stylish apartment in the heart of Paris with a balcony overlooking the Eiffel Tower.',
                capacity: 4,
                amenities: ['Balcony', 'Wifi', 'Coffee machine', 'Luxury bath'],
                labels: ['Romantic', 'Iconic View', 'Luxury'],
                host: {
                    _id: 'u111',
                    fullname: 'Sophie Laurent',
                    imgUrl: 'https://loremflickr.com/200/200?random=65',
                    yearsHosting: 5,
                },
                likedByUsers: [],
            },
            {
                _id: 's112',
                name: 'Lake Tahoe Retreat',
                loc: {
                    country: 'USA',
                    city: 'Lake Tahoe',
                    address: 'Evergreen Rd. 15',
                },
                imgUrls: [
                    'https://loremflickr.com/200/200?random=66',
                    'https://loremflickr.com/200/200?random=67',
                    'https://loremflickr.com/200/200?random=68',
                ],
                price: 720,
                reviews: [
                    {
                        id: 'review12',
                        txt: 'A perfect cabin in the woods with breathtaking views!',
                        rate: 4.85,
                        by: {
                            _id: 'u112',
                            fullname: 'user17',
                            imgUrl: 'https://loremflickr.com/200/200?random=69',
                        },
                    },
                ],
                distance: '1,200 kilometers away',
                dates: 'Dec 5 - Dec 12',
                type: 'Cabin',
                bedrooms: 3,
                beds: 4,
                baths: 2,
                summary: 'A cozy retreat surrounded by nature, perfect for relaxing.',
                capacity: 6,
                amenities: ['Fireplace', 'Hot tub', 'Ski-in/Ski-out', 'Lake view'],
                labels: ['Nature', 'Relaxing', 'Family-friendly'],
                host: {
                    _id: 'u112',
                    fullname: 'Jake Thompson',
                    imgUrl: 'https://loremflickr.com/200/200?random=70',
                    yearsHosting: 6,
                },
                likedByUsers: [],
            },
            {
                _id: 's113',
                name: 'Tokyo Skyline Suite',
                loc: {
                    country: 'Japan',
                    city: 'Tokyo',
                    address: 'Shibuya Crossing 10',
                },
                imgUrls: [
                    'https://loremflickr.com/200/200?random=71',
                    'https://loremflickr.com/200/200?random=72',
                    'https://loremflickr.com/200/200?random=73',
                ],
                price: 980,
                reviews: [
                    {
                        id: 'review13',
                        txt: 'A high-tech apartment with an unbeatable view!',
                        rate: 4.93,
                        by: {
                            _id: 'u113',
                            fullname: 'user18',
                            imgUrl: 'https://loremflickr.com/200/200?random=74',
                        },
                    },
                ],
                distance: '9,800 kilometers away',
                dates: 'Jan 20 - Jan 27',
                type: 'Penthouse',
                bedrooms: 2,
                beds: 2,
                baths: 1,
                summary: 'A luxurious suite in Shibuya with smart home features and a breathtaking skyline view.',
                capacity: 3,
                amenities: ['Smart Home', 'High-speed Wifi', 'Japanese Bath', 'Rooftop Garden'],
                labels: ['Modern', 'Cityscape', 'High-tech'],
                host: {
                    _id: 'u113',
                    fullname: 'Kenji Tanaka',
                    imgUrl: 'https://loremflickr.com/200/200?random=75',
                    yearsHosting: 4,
                },
                likedByUsers: [],
            },
        ]
        console.log(stays)
        storageService.saveToStorage(STORAGE_KEY, stays)
    }
}