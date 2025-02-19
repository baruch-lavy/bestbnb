import { Outlet } from 'react-router'
import { NavLink } from 'react-router-dom'
import { FaAirbnb } from 'react-icons/fa'

export function LoginSignup() {
    return (
        <div className="login-signup-page">
            <div className="auth-container">
                <div className="auth-header">
                    <div className="logo">
                        <FaAirbnb />
                        <span>bestbnb</span>
                    </div>
                    <h1>Welcome to Bestbnb</h1>
                    <nav className="auth-nav">
                        <NavLink to="." end>Login</NavLink>
                        <NavLink to="signup">Sign up</NavLink>
                    </nav>
                </div>
                <div className="auth-content">
                    <Outlet/>
                </div>
            </div>
            <div className="auth-background"></div>
        </div>
    )
}