import { useState } from 'react'
import { useNavigate } from 'react-router'
import { signup } from '../store/actions/user.actions'
import { ImgUploader } from '../cmps/ImgUploader'
import { userService } from '../services/user'
import { FaCamera } from 'react-icons/fa'

export function Signup() {
    const [credentials, setCredentials] = useState(userService.getEmptyUser())
    const navigate = useNavigate()

    function clearState() {
        setCredentials({ username: '', password: '', fullname: '', imgUrl: '' })
    }

    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }
    
    async function onSignup(ev = null) {
        if (ev) ev.preventDefault()
        if (!credentials.username || !credentials.password || !credentials.fullname) return
        await signup(credentials)
        clearState()
        navigate('/')
    }

    function onUploaded(imgUrl) {
        setCredentials({ ...credentials, imgUrl })
    }

    return (
        <div className="modal-content">
            <h2>Sign up for Bestbnb</h2>
            <form className="signup-form" onSubmit={onSignup}>
                <input
                    type="text"
                    name="fullname"
                    value={credentials.fullname}
                    placeholder="Full name"
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="username"
                    value={credentials.username}
                    placeholder="Username"
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    placeholder="Password"
                    onChange={handleChange}
                    required
                />
                <div className="img-upload-container">
                    <ImgUploader onUploaded={onUploaded} />
                    <span className="upload-icon">
                        <FaCamera />
                    </span>
                </div>
                <button disabled={!credentials.username || !credentials.password || !credentials.fullname}>
                    Sign up
                </button>
            </form>
        </div>
    )
}