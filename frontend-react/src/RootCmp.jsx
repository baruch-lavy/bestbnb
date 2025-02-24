import React from 'react'
import { Routes, Route } from 'react-router'

import { HomePage } from './pages/HomePage'
import { AboutUs, AboutTeam, AboutVision } from './pages/AboutUs'
import { StayIndex } from './pages/StayIndex.jsx'
import { ReviewIndex } from './pages/ReviewIndex.jsx'
// import { ChatApp } from './pages/Chat.jsx'
import { AdminIndex } from './pages/AdminIndex.jsx'

import { StayDetails } from './pages/StayDetails'
import { UserDetails } from './pages/UserDetails'

import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'
import { FloatingMap } from './cmps/FloatingMap'
import { UserMsg } from './cmps/UserMsg.jsx'
import { BookOrder } from './cmps/BookOrder.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { SearchResults } from './pages/SearchResults.jsx';
import { Trips } from './pages/Trips'
import { StayGallery } from './cmps/StayGallery.jsx'
// import { OrderConfirmation } from './cmps/OrderConfirmation'

export function RootCmp() {
    return (
        <div className="main-container">
            <AppHeader className="app" />
            <UserMsg />

            <main>
                <Routes>
                    <Route path="" element={<HomePage />} />
                    <Route path="" element={<FloatingMap />} />
                    <Route path="about" element={<AboutUs />}>
                        <Route path="team" element={<AboutTeam />} />
                        <Route path="vision" element={<AboutVision />} />
                    </Route>
                    <Route path="stay" element={<StayIndex />} />
                    <Route path="stay/:stayId" element={<StayDetails />} />
                    <Route path="user/:id" element={<UserDetails />} />
                    <Route path="/stay/book/:id" element={<BookOrder />} />
                    <Route path="/stay/gallery/:id" element={<StayGallery />} />
                    <Route path="review" element={<ReviewIndex />} />
                    {/* <Route path="chat" element={<ChatApp />} /> */}
                    <Route path="admin" element={<AdminIndex />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/search-results" element={<SearchResults />} />
                    <Route path="/trips" element={<Trips />} />
                    {/* <Route path="/confirmation" element={<OrderConfirmation />} /> */}
                </Routes>
            </main>
            <AppFooter />
        </div>
    )
}


