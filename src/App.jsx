// import { useState } from 'react'
import './App.css'

import {Route, Routes} from "react-router-dom";
import UserLessonPlanning from "./pages/LessonPlanning/UserLessonPlanning/UserLessonPlanning.jsx";
import AdminLessonPlanning from "./pages/LessonPlanning/AdminLessonPlanning/AdminLessonPlanning.jsx";
import UserGallery from "./pages/UserGallery/UserGallery.jsx";
import UserSettings from "./pages/UserSettings/UserSettings.jsx";
import UserHeader from "./components/Headers/UserHeader.jsx";
import AdminHeader from "./components/Headers/AdminHeader.jsx";
import {useState} from "react";
import userTestData1 from "./TestData/userTestData1.json";
import Login from "./pages/Login/Login.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminGalleryManager from "./pages/AdminGalleryManager/AdminGalleryManager.jsx";
import AdminSettings from "./pages/AdminSettings/AdminSettings.jsx";
import AdminAcountManager from "./pages/AdminAcountManager/AdminAcountManager.jsx";

function App() {

    const [user, setUser] = useState(userTestData1);

    return (
        <>
            <Routes>
                {/* Public Route */}
                <Route path="/login" element={<Login />} />

                {/* Protected User Routes */}
                <Route path="/planning" element={<PrivateRoute><UserHeader /><UserLessonPlanning user={user} /></PrivateRoute>} />
                <Route path="/gallerij" element={<PrivateRoute><UserHeader /><UserGallery user={user} /></PrivateRoute>} />
                <Route path="/settings" element={<PrivateRoute><UserHeader /><UserSettings user={user} setUser={setUser} /></PrivateRoute>} />
                <Route path="*" element={<PrivateRoute><UserHeader /><h2>Pagina niet gevonden</h2></PrivateRoute>} />

                {/* Protected Admin Routes */}
                <Route path="/planning-beheer" element={<PrivateRoute adminOnly={true}><AdminHeader /><AdminLessonPlanning user={user} /></PrivateRoute>} />
                <Route path="/gallerij-beheer" element={<PrivateRoute adminOnly={true}><AdminHeader /><AdminGalleryManager user={user} /></PrivateRoute>} />
                <Route path="/account-beheer" element={<PrivateRoute adminOnly={true}><AdminHeader /><AdminAcountManager user={user} /></PrivateRoute>} />
                <Route path="/admin-settings" element={<PrivateRoute adminOnly={true}><AdminHeader /><AdminSettings user={user} /></PrivateRoute>} />
            </Routes>
        </>
    )
}

export default App
