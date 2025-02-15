import { Routes, Route } from 'react-router-dom'
import { StayDetails } from './pages/StayDetails'
import { StayIndex } from './pages/StayIndex'

export function App() {
    return (
        <div className="app">
            <AppHeader />
            <main className="main-app">
                <Routes>
                    <Route path="/" element={<StayIndex />} />
                    <Route path="/stay/:stayId" element={<StayDetails />} />
                </Routes>
            </main>
            <AppFooter />
        </div>
    )
} 