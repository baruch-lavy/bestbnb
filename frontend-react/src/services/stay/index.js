const { DEV, VITE_LOCAL } = import.meta.env

import { getRandomIntInclusive, makeId } from '../util.service'

import { stayService as local } from './stay.service.local'
import { stayService as remote } from './stay.service.remote'

function getEmptyStay() {
    return {
        type: 'House',
        imgUrls: [
            'https://loremflickr.com/200/200?random=1',
            'https://loremflickr.com/200/200?random=2',
            'https://loremflickr.com/200/200?random=3',
            'https://loremflickr.com/200/200?random=4',
            'https://loremflickr.com/200/200?random=5',
            'https://loremflickr.com/200/200?random=6',
        ],
        price: getRandomIntInclusive(80, 240),
        summary: 'Fantastic duplex apartment...',
        capacity: getRandomIntInclusive(1, 10),
        amenities: ['TV', 'Wifi', 'Kitchen', 'Smoking allowed', 'Pets allowed', 'Cooking basics'],
        labels: ['Top of the world', 'Trending', 'Play', 'Tropical'],
        msgs: [],
    }
}

export function getDefaultFilter() {
    return {
        txt: '',
        minPrice: 0,
        maxPrice: Infinity,
        destination: '',
        guests: 0,
        startDate: null,
        endDate: null,
        // sortField: '',
        // sortDir: '',
    }
}

const service = VITE_LOCAL === 'true' ? local : remote
export const stayService = { getEmptyStay, getDefaultFilter, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.stayService = stayService
