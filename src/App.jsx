// import { useState } from 'react'
import './App.css'

import {Route, Routes} from "react-router-dom";
import UserLessonPlanning from "./pages/userLessonPlanning/UserLessonPlanning.jsx";
import AdminLessonPlanning from "./pages/adminLessonPlanning/AdminLessonPlanning.jsx";
import UserGallery from "./pages/userGallery/UserGallery.jsx";
import UserSettings from "./pages/userSettings/UserSettings.jsx";
import UserHeader from "./components/Headers/UserHeader.jsx";
import AdminHeader from "./components/Headers/AdminHeader.jsx";

function App() {

    return (
        <>
            {/*<AdminHeader/>*/}
            <UserHeader/>
            <Routes>
                <Route Path="/" element={<UserLessonPlanning/>}/>
                <Route path="/gallerij" element={<UserGallery/>}/>
                <Route path="/settings" element={<UserSettings/>}/>
                {/*<Route path="/*" element={ <h2>Pagina niet gevonden</h2> }/>*/}
            </Routes>
        </>
    )
}

export default App
