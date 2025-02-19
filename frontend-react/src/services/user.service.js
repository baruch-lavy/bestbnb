import { storageService } from './async-storage.service'

const STORAGE_KEY = 'userDB'
const LOGGED_IN_KEY = 'loggedInUser'

export const userService = {
    login,
    logout,
    signup,
    getLoggedinUser,
    getUsers,
    getById,
    remove,
    update,
    changeScore
}

window.userService = userService

function getUsers() {
    return storageService.query(STORAGE_KEY)
}

async function getById(userId) {
    const user = await storageService.get(STORAGE_KEY, userId)
    return user
}

function remove(userId) {
    return storageService.remove(STORAGE_KEY, userId)
}

async function update(user) {
    await storageService.put(STORAGE_KEY, user)
    if (getLoggedinUser()._id === user._id) _saveLocalUser(user)
    return user
}

async function login(credentials) {
    const users = await storageService.query(STORAGE_KEY)
    const user = users.find(u => u.username === credentials.username)
    if (!user) return Promise.reject('Invalid username or password')
    _saveLocalUser(user)
    return user
}

async function signup(credentials) {
    const user = await storageService.post(STORAGE_KEY, credentials)
    _saveLocalUser(user)
    return user
}

async function logout() {
    sessionStorage.removeItem(LOGGED_IN_KEY)
}

function changeScore(by) {
    const user = getLoggedinUser()
    if (!user) throw new Error('Not logged in')
    user.score = user.score + by || by
    return update(user)
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(LOGGED_IN_KEY) || 'null')
}

// Initial data
_createUsers()

function _createUsers() {
    let users = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!users || !users.length) {
        users = [
            {
                _id: 'u101',
                fullname: 'Guest User',
                username: 'guest',
                password: 'guest',
                imgUrl: 'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg',
                isAdmin: false
            },
            {
                _id: 'u102',
                fullname: 'Host User',
                username: 'host',
                password: 'host',
                imgUrl: 'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg',
                isAdmin: false
            }
        ]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
    }
}

function _saveLocalUser(user) {
    user = { _id: user._id, fullname: user.fullname, imgUrl: user.imgUrl, isAdmin: user.isAdmin }
    sessionStorage.setItem(LOGGED_IN_KEY, JSON.stringify(user))
    return user
} 