import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { userService } from '../services/user'
import { login } from '../store/actions/user.actions'
import { FaUserCircle, FaGoogle, FaFacebook } from 'react-icons/fa'

export function Login() {
    const [users, setUsers] = useState([])
    const [credentials, setCredentials] = useState({ username: '', password: '', fullname: '' })
    const navigate = useNavigate()

    useEffect(() => {
        loadUsers()
    }, [])

    async function loadUsers() {
        const users = await userService.getUsers()
        setUsers(users)
    }

    async function onLogin(ev = null) {
        if (ev) ev.preventDefault()
        if (!credentials.username) return
        await login(credentials)
        navigate('/')
    }

    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }
    
    return (
        <div className="auth-form-container">
            <form className="login-form" onSubmit={onLogin}>
                <select
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}>
                    <option value="">Choose your account</option>
                    {users.map(user => 
                        <option key={user._id} value={user.username}>
                            {user.fullname}
                        </option>
                    )}
                </select>

                <button className="primary-btn" disabled={!credentials.username}>
                    Continue
                </button>

                <div className="or-divider">
                    <span>or continue with</span>
                </div>

                <div className="social-buttons">
                    <button type="button" className="social-login-btn">
                        <FaGoogle /> Google
                    </button>
                    <button type="button" className="social-login-btn">
                        <FaFacebook /> Facebook
                    </button>
                </div>

                <button type="button" className="social-login-btn guest-btn">
                    <FaUserCircle /> Continue as Guest
                </button>
            </form>
        </div>
    )
}