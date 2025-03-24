// import { useState } from 'react'
import './App.css'

import {Route, Routes} from "react-router-dom";
import UserLessonPlanning from "./pages/userLessonPlanning/UserLessonPlanning.jsx";
import AdminLessonPlanning from "./pages/adminLessonPlanning/AdminLessonPlanning.jsx";
import UserGallery from "./pages/userGallery/UserGallery.jsx";
import UserSettings from "./pages/userSettings/UserSettings.jsx";
import UserHeader from "./components/Headers/UserHeader.jsx";
import AdminHeader from "./components/Headers/AdminHeader.jsx";
import {useState} from "react";
import userTestData1 from "./testData/userTestData1.json";

function App() {

    const [user, setUser] = useState(userTestData1);

    return (
        <>
            {/*<AdminHeader/>*/}
            <UserHeader/>

            <Routes>
                <Route path="/" element={<UserLessonPlanning user={user} />}/>
                <Route path="/gallerij" element={<UserGallery user={user}/>}/>
                <Route path="/settings" element={<UserSettings user={user} setUser={setUser} />}/>
                {/*<Route path="/*" element={ <h2>Pagina niet gevonden</h2> }/>*/}
            </Routes>
        </>
    )
}

export default App
