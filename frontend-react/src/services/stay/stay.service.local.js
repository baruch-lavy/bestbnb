import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'stay'
_createStays()

// const categoryMapping = {
//     'OMG!': ['Luxury', 'Exclusive'],
//     'Icons': ['Modern', 'Urban'],
//     'Castles': ['Villa', 'Mansion'],
//     'Beachfront': ['Beachfront', 'Seaview'],
//     'Cabins': ['Cabin', 'Cottage'],
//     // ... add more mappings
// }

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
                summary: `This exquisitely renovated Oceanfront penthouse features designer bedrooms with spectacular views, a brand new chef's kitchen with a modern decor, a sunny living room with custom lighting, spa-inspired luxury bathrooms with rainfall shower heads and body jets, LED mood lighting shower niches, and unobstructed beach and ocean views that simply can't be beaten. Every detail is designed to give guests a stylish and sophisticated place to relax while offering all of the upscale amenities you'd expec
                The space
                ☆☆ BEDROOMS ☆☆
                This home has two designer bedrooms, both complete with luxury mattresses, beach-inspired decor, decorative light fixtures, and handcrafted furniture. The primary suite has spectacular beach and ocean views from the large picture window and sliders, a 40" TCL Fire TV, and a nicely appointed ensuite bathroom. This room also has a swivel chair by the picture window, perfect for sipping coffee and taking in the incredible view - It's the perfect retreat! The guest bedroom features bay views, two queen beds, a center nightstand, 6-drawer dresser, and a 40" TCL Fire TV.
                
                ☆☆ KITCHEN ☆☆
                Every detail of the newly renovated designer kitchen has been designed with comfort, convenience, and style in mind, and the open concept design makes it easy for multiple people to move throughout the space. The newly-renovated kitchen is stocked with all the essentials and ready for you to enjoy. Here you'll find a sprawling peninsula with a waterfall edge island, new LG stainless-steel appliances, a sleek marble pattern quartz countertops with a full backsplash and undermount lighting, two-tone soft-close shaker cabinets, and unobstructed views of the water through the living and dining space. Brew coffee in the your choice of standard drip and K-cup coffee makers, pop bread into the toaster, or throw some fruit into the blender for a healthy and quick breakfast on the go. While there are many restaurants to choose from in Ocean City, on nights when you want to just cook at home, this kitchen offers the space and appliances you need so you can cook as you do at home.
                
                ☆☆ DINING & LIVING ROOM ☆☆
                The dining room features a coastal theme and comfortable seating for 6, complimented by bar seating for 3. The open concept effortlessly transitions into the living room, a space that fills with sunshine in the morning and will quickly become your family's favorite hangout spot. Complete with high-end furniture, beach-inspired decor, a stylish entertainment center, and a massive flat-screen TV, this living room has it all. Sleek and dimmable cove lighting creates the perfect ambiance for cocktail hour or movie night. And while the 65" 4K LED HDTV (with Amazon Prime Video, Apple TV, Disney+, HBO Max, Hulu, and Netflix) is perfect for movie night, it can be hard to focus on a movie or a show when you have such breathtaking views of the beach and ocean right outside!
                
                ☆☆OUTDOOR SPACE ☆☆
                One of the things you’ll love about this incredible retreat is the way you can see the water from almost every room in the house. Push open the sliding glass doors from the living room and step out onto your own private balcony. This shady space features comfortable outdoor lounge furniture with seating for 5 and jaw dropping views of the beach. Take a family photo, draw inspiration from a breathtaking sunrise, enjoy cocktails with cotton-candy skies at sunset, or enjoy a cup of coffee in the morning while taking in the view.
                
                ★☆ Book Today & Enjoy the Luxurious Beach Vacation You Deserve In Ocean City! ☆★
                Guest access
                As a guest here, you have access to the entire home. You can use all of the rooms and all the amenities, including the full-sized washer and dryer, Wi-Fi, kitchen and bathroom essentials, and helpful information about the local area. From here you're just minutes from local grocery stores, beach boutiques, spas, salons, waterfront restaurants, and Ocean City's vibrant nightlife scene.
                
                You’ll also have exclusive access to resort amenities, including the indoor heated pool, hot-tub, sun-bathing deck, and direct beach access. You will be assigned two parking spaces and given a unique door code for access.
                Registration number
                83207`,
                capacity: 4,
                amenities:   ['Wifi', 'Free parking on premises', 'BBQ grill: gas', 'TV', 'Smoke alarm', 'Indoor fireplace: wood-burning', 'Central air conditioning'],
                labels: ['City life', 'Cozy', 'Modern'],
                host: {
                    _id: 'u102',
                    fullname: 'Maria Lopes',
                    imgUrl: 'https://loremflickr.com/200/200?random=19',
                    yearsHosting: 5,
                },
                isFavorite: true,
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
                amenities: ['Private pool', 'Wifi', 'EV charger', 'Self check-in', 'Carbon monoxide alarm', 'TV', 'Long term stays allowed'],
                labels: ['Seaview', 'Luxury', 'Private'],
                host: {
                    _id: 'u103',
                    fullname: 'Carlos Fernandez',
                    imgUrl: 'https://loremflickr.com/200/200?random=25',
                    yearsHosting: 6,
                },
                isFavorite: false,
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
                amenities: ['Iron', 'Central heating', 'Free washer – In building', 'Hair dryer', 'Private entrance', 'Private hot tub', 'Crib - always at the listing'],
                labels: ['Nature', 'Peaceful', 'Scenic'],
                host: {
                    _id: 'u104',
                    fullname: 'Anna Müller',
                    imgUrl: 'https://loremflickr.com/200/200?random=30',
                    yearsHosting: 7,
                },
                isFavorite: true,
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
                amenities:  ['Bay view', 'Private pool', 'Private entrance', 'EV charger', 'Iron', 'BBQ grill: gas', 'Wifi'],
                labels: ['Rustic', 'Cozy', 'Nature'],
                host: {
                    _id: 'u105',
                    fullname: 'Jean Dupont',
                    imgUrl: 'https://loremflickr.com/200/200?random=35',
                    yearsHosting: 3,
                },
                isFavorite: false,
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
                amenities:   ['Smoke alarm', 'Central air conditioning', 'Wifi', 'Private hot tub', 'Private pool', 'Crib - always at the listing', 'Carbon monoxide alarm'],
                labels: ['Nature', 'Relaxing', 'Scenic'],
                host: {
                    _id: 'u106',
                    fullname: 'Jake Morrison',
                    imgUrl: 'https://loremflickr.com/200/200?random=40',
                    yearsHosting: 6,
                },
                isFavorite: true,
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
                amenities:   ['TV', 'Self check-in', 'Iron', 'Private entrance', 'Wifi', 'Free parking on premises', 'Long term stays allowed'],
                labels: ['Urban', 'Modern', 'Luxury'],
                host: {
                    _id: 'u107',
                    fullname: 'Yuki Tanaka',
                    imgUrl: 'https://loremflickr.com/200/200?random=45',
                    yearsHosting: 3,
                },
                isFavorite: false,
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
                isFavorite: true,
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
                isFavorite: false,
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
                isFavorite: true,
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
                isFavorite: false,
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
                isFavorite: true,
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
                isFavorite: false,
                likedByUsers: [],
            },
            {
                _id: 's114',
                name: 'Santorini Cliffside Villa',
                loc: {
                    country: 'Greece',
                    city: 'Santorini',
                    address: 'Oia Sunset Blvd. 3',
                },
                imgUrls: [
                    'https://loremflickr.com/200/200?random=76',
                    'https://loremflickr.com/200/200?random=77',
                    'https://loremflickr.com/200/200?random=78',
                ],
                price: 1050,
                reviews: [
                    {
                        id: 'review14',
                        txt: 'Unforgettable sunsets and crystal-clear waters!',
                        rate: 4.97,
                        by: {
                            _id: 'u114',
                            fullname: 'user19',
                            imgUrl: 'https://loremflickr.com/200/200?random=79',
                        },
                    },
                ],
                distance: '6,300 kilometers away',
                dates: 'Sep 12 - Sep 19',
                type: 'Villa',
                bedrooms: 3,
                beds: 3,
                baths: 2,
                summary: 'A luxurious whitewashed villa perched on a cliff, offering breathtaking views of the Aegean Sea.',
                capacity: 5,
                amenities: ['Infinity pool', 'Sea view', 'Private terrace', 'Sun loungers'],
                labels: ['Romantic', 'Seaside', 'Luxury'],
                host: {
                    _id: 'u114',
                    fullname: 'Maria Papadopoulos',
                    imgUrl: 'https://loremflickr.com/200/200?random=80',
                    yearsHosting: 8,
                },
                isFavorite: true,
                likedByUsers: [],
            },
            {
                _id: 's115',
                name: 'Swiss Alps Chalet',
                loc: {
                    country: 'Switzerland',
                    city: 'Zermatt',
                    address: 'Matterhorn View 8',
                },
                imgUrls: [
                    'https://loremflickr.com/200/200?random=81',
                    'https://loremflickr.com/200/200?random=82',
                    'https://loremflickr.com/200/200?random=83',
                ],
                price: 1120,
                reviews: [
                    {
                        id: 'review15',
                        txt: 'Perfect for ski lovers and mountain adventurers!',
                        rate: 4.91,
                        by: {
                            _id: 'u115',
                            fullname: 'user20',
                            imgUrl: 'https://loremflickr.com/200/200?random=84',
                        },
                    },
                ],
                distance: '7,200 kilometers away',
                dates: 'Feb 1 - Feb 8',
                type: 'Chalet',
                bedrooms: 4,
                beds: 6,
                baths: 3,
                summary: 'A cozy wooden chalet nestled in the Swiss Alps, with a fireplace and a stunning view of the Matterhorn.',
                capacity: 8,
                amenities: ['Ski-in/Ski-out', 'Fireplace', 'Sauna', 'Mountain view'],
                labels: ['Adventure', 'Cozy', 'Scenic'],
                host: {
                    _id: 'u115',
                    fullname: 'Hans Meier',
                    imgUrl: 'https://loremflickr.com/200/200?random=85',
                    yearsHosting: 10,
                },
                isFavorite: false,
                likedByUsers: [],
            },
            {
                _id: 's116',
                name: 'New York Loft',
                loc: {
                    country: 'USA',
                    city: 'New York',
                    address: 'Brooklyn Heights 22',
                },
                imgUrls: [
                    'https://loremflickr.com/200/200?random=86',
                    'https://loremflickr.com/200/200?random=87',
                    'https://loremflickr.com/200/200?random=88',
                ],
                price: 880,
                reviews: [
                    {
                        id: 'review16',
                        txt: 'A stylish industrial loft in the heart of Brooklyn!',
                        rate: 4.88,
                        by: {
                            _id: 'u116',
                            fullname: 'user21',
                            imgUrl: 'https://loremflickr.com/200/200?random=89',
                        },
                    },
                ],
                distance: '2,500 kilometers away',
                dates: 'Mar 15 - Mar 22',
                type: 'Loft',
                bedrooms: 1,
                beds: 1,
                baths: 1,
                summary: 'A modern and stylish loft in Brooklyn with an open-plan design and an artistic vibe.',
                capacity: 2,
                amenities: ['Exposed brick', 'Rooftop access', 'High-speed Wifi', 'Smart TV'],
                labels: ['Urban', 'Trendy', 'Minimalist'],
                host: {
                    _id: 'u116',
                    fullname: 'Jessica Turner',
                    imgUrl: 'https://loremflickr.com/200/200?random=90',
                    yearsHosting: 3,
                },
                isFavorite: false,
                likedByUsers: [],
            },
            {
                _id: 's117',
                name: 'Dubai Marina Penthouse',
                loc: {
                    country: 'UAE',
                    city: 'Dubai',
                    address: 'Palm Jumeirah 18',
                },
                imgUrls: [
                    'https://loremflickr.com/200/200?random=91',
                    'https://loremflickr.com/200/200?random=92',
                    'https://loremflickr.com/200/200?random=93',
                ],
                price: 1300,
                reviews: [
                    {
                        id: 'review17',
                        txt: 'Extravagant, luxurious, and worth every penny!',
                        rate: 5.0,
                        by: {
                            _id: 'u117',
                            fullname: 'user22',
                            imgUrl: 'https://loremflickr.com/200/200?random=94',
                        },
                    },
                ],
                distance: '4,500 kilometers away',
                dates: 'May 10 - May 17',
                type: 'Penthouse',
                bedrooms: 3,
                beds: 3,
                baths: 3,
                summary: 'A high-end penthouse in Dubai Marina with floor-to-ceiling windows and a private infinity pool.',
                capacity: 6,
                amenities: ['Infinity pool', 'Smart home system', 'Ocean view', 'Gym'],
                labels: ['Luxury', 'Seaside', 'Exclusive'],
                host: {
                    _id: 'u117',
                    fullname: 'Omar Khalid',
                    imgUrl: 'https://loremflickr.com/200/200?random=95',
                    yearsHosting: 9,
                },
                isFavorite: true,
                likedByUsers: [],
            },
            {
                _id: 's118',
                name: 'Parisian Eiffel View Apartment',
                loc: {
                    country: 'France',
                    city: 'Paris',
                    address: 'Champs-Élysées 12',
                },
                imgUrls: [
                    'https://loremflickr.com/200/200?random=96',
                    'https://loremflickr.com/200/200?random=97',
                    'https://loremflickr.com/200/200?random=98',
                ],
                price: 970,
                reviews: [
                    {
                        id: 'review18',
                        txt: 'Amazing location with a direct view of the Eiffel Tower!',
                        rate: 4.9,
                        by: {
                            _id: 'u118',
                            fullname: 'user23',
                            imgUrl: 'https://loremflickr.com/200/200?random=99',
                        },
                    },
                ],
                distance: '3,400 kilometers away',
                dates: 'Jun 10 - Jun 17',
                type: 'Apartment',
                bedrooms: 2,
                beds: 2,
                baths: 1,
                summary: 'A charming apartment in the heart of Paris with breathtaking views of the Eiffel Tower.',
                capacity: 4,
                amenities: ['Balcony', 'Smart TV', 'Fully equipped kitchen', 'WiFi'],
                labels: ['Romantic', 'Urban', 'Scenic'],
                host: {
                    _id: 'u118',
                    fullname: 'Sophie Dubois',
                    imgUrl: 'https://loremflickr.com/200/200?random=100',
                    yearsHosting: 5,
                },
                likedByUsers: [],
            },
            {
                _id: 's119',
                name: 'Tokyo Skyline Penthouse',
                loc: {
                    country: 'Japan',
                    city: 'Tokyo',
                    address: 'Shibuya Crossing 5',
                },
                imgUrls: [
                    'https://loremflickr.com/200/200?random=101',
                    'https://loremflickr.com/200/200?random=102',
                    'https://loremflickr.com/200/200?random=103',
                ],
                price: 1200,
                reviews: [
                    {
                        id: 'review19',
                        txt: 'Futuristic design with an unbeatable cityscape view!',
                        rate: 4.92,
                        by: {
                            _id: 'u119',
                            fullname: 'user24',
                            imgUrl: 'https://loremflickr.com/200/200?random=104',
                        },
                    },
                ],
                distance: '9,000 kilometers away',
                dates: 'Jul 20 - Jul 27',
                type: 'Penthouse',
                bedrooms: 3,
                beds: 3,
                baths: 2,
                summary: 'A luxurious penthouse with panoramic city views and a high-tech interior.',
                capacity: 6,
                amenities: ['Jacuzzi', 'Smart home system', 'City view', 'Private bar'],
                labels: ['Modern', 'Luxury', 'Tech-savvy'],
                host: {
                    _id: 'u119',
                    fullname: 'Kenji Tanaka',
                    imgUrl: 'https://loremflickr.com/200/200?random=105',
                    yearsHosting: 6,
                },
                likedByUsers: [],
            },
            {
                _id: 's120',
                name: 'Venetian Grand Canal View',
                loc: {
                    country: 'Italy',
                    city: 'Venice',
                    address: 'Rialto Bridge 10',
                },
                imgUrls: [
                    'https://loremflickr.com/200/200?random=106',
                    'https://loremflickr.com/200/200?random=107',
                    'https://loremflickr.com/200/200?random=108',
                ],
                price: 890,
                reviews: [
                    {
                        id: 'review20',
                        txt: 'Magical experience by the canals of Venice!',
                        rate: 4.85,
                        by: {
                            _id: 'u120',
                            fullname: 'user25',
                            imgUrl: 'https://loremflickr.com/200/200?random=109',
                        },
                    },
                ],
                distance: '2,500 kilometers away',
                dates: 'Sep 5 - Sep 12',
                type: 'Apartment',
                bedrooms: 2,
                beds: 2,
                baths: 1,
                summary: 'A traditional Venetian home with breathtaking canal views.',
                capacity: 4,
                amenities: ['Boat access', 'Historical charm', 'WiFi', 'Kitchen'],
                labels: ['Romantic', 'Historic', 'Scenic'],
                host: {
                    _id: 'u120',
                    fullname: 'Giovanni Rossi',
                    imgUrl: 'https://loremflickr.com/200/200?random=110',
                    yearsHosting: 7,
                },
                likedByUsers: [],
            },
            {
                _id: 's121',
                name: 'Santorini Sunset Villa',
                loc: {
                    country: 'Greece',
                    city: 'Santorini',
                    address: 'Oia Cliffside 3',
                },
                imgUrls: [
                    'https://loremflickr.com/200/200?random=111',
                    'https://loremflickr.com/200/200?random=112',
                    'https://loremflickr.com/200/200?random=113',
                ],
                price: 1200,
                reviews: [
                    {
                        id: 'review21',
                        txt: 'The most stunning sunset Ive ever seen!',
                        rate: 4.98,
                        by: {
                            _id: 'u121',
                            fullname: 'user26',
                            imgUrl: 'https://loremflickr.com/200/200?random=114',
                        },
                    },
                ],
                distance: '3,100 kilometers away',
                dates: 'Oct 1 - Oct 8',
                type: 'Villa',
                bedrooms: 3,
                beds: 3,
                baths: 2,
                summary: 'A luxurious Greek villa with breathtaking sunset views over the Aegean Sea.',
                capacity: 6,
                amenities: ['Infinity pool', 'Ocean view', 'Outdoor lounge', 'Kitchen'],
                labels: ['Luxury', 'Romantic', 'Seaside'],
                host: {
                    _id: 'u121',
                    fullname: 'Elena Papadopoulos',
                    imgUrl: 'https://loremflickr.com/200/200?random=115',
                    yearsHosting: 5,
                },
                likedByUsers: [],
            },
            {
                _id: 's122',
                name: 'Swiss Alps Chalet',
                loc: {
                    country: 'Switzerland',
                    city: 'Zermatt',
                    address: 'Matterhorn Rd. 15',
                },
                imgUrls: [
                    'https://loremflickr.com/200/200?random=116',
                    'https://loremflickr.com/200/200?random=117',
                    'https://loremflickr.com/200/200?random=118',
                ],
                price: 1500,
                reviews: [
                    {
                        id: 'review22',
                        txt: 'A perfect getaway in the mountains!',
                        rate: 4.93,
                        by: {
                            _id: 'u122',
                            fullname: 'user27',
                            imgUrl: 'https://loremflickr.com/200/200?random=119',
                        },
                    },
                ],
                distance: '2,800 kilometers away',
                dates: 'Dec 20 - Dec 27',
                type: 'Chalet',
                bedrooms: 4,
                beds: 4,
                baths: 3,
                summary: 'A cozy Swiss chalet with direct access to ski slopes and mountain views.',
                capacity: 8,
                amenities: ['Fireplace', 'Ski-in/Ski-out', 'Hot tub', 'Mountain view'],
                labels: ['Ski retreat', 'Luxury', 'Scenic'],
                host: {
                    _id: 'u122',
                    fullname: 'Luca Müller',
                    imgUrl: 'https://loremflickr.com/200/200?random=120',
                    yearsHosting: 8,
                },
                likedByUsers: [],
            },
        
        ]
        console.log(stays)
        storageService.saveToStorage(STORAGE_KEY, stays)
    }
}