"use client";

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CookieConsent from 'react-cookie-consent';
import Homepage from './pages/Homepage';
import Room from './pages/[code]';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import PrivacyPolicy from "@/app/pages/PrivacyPolicy";

export default function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Header/>
                <Routes>
                    <Route path="/" element={<Homepage/>}/>
                    <Route path="/:code" element={<Room/>}/>
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                </Routes>
                <CookieConsent>
                    This website uses cookies to enhance the user experience.
                </CookieConsent>
                <Footer/>
            </div>
        </Router>

);
}