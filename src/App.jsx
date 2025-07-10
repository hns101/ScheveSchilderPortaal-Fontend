import './App.css'
import {Navigate, Route, Routes} from "react-router-dom";
import UserLessonPlanning from "./pages/LessonPlanning/UserLessonPlanning/UserLessonPlanning.jsx";
import AdminLessonPlanning from "./pages/LessonPlanning/AdminLessonPlanning/AdminLessonPlanning.jsx";
import UserGallery from "./pages/UserGallery/UserGallery.jsx";
import UserSettings from "./pages/UserSettings/UserSettings.jsx";
import UserHeader from "./components/Headers/UserHeader.jsx";
import AdminHeader from "./components/Headers/AdminHeader.jsx";
import Login from "./pages/Login/Login.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminGalleryManager from "./pages/AdminGalleryManager/AdminGalleryManager.jsx";
import AdminAcountManager from "./pages/AdminAcountManager/AdminAcountManager.jsx";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword/ResetPassword.jsx"; // Import the new component

function App() {

    return (
        <>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* Add the new dynamic route */}


                {/* Redirect root to login */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* Protected User Routes */}
                <Route path="/planning" element={<PrivateRoute><UserHeader /><UserLessonPlanning /></PrivateRoute>} />
                <Route path="/gallerij" element={<PrivateRoute><UserHeader /><UserGallery /></PrivateRoute>} />
                <Route path="/settings" element={<PrivateRoute><UserHeader /><UserSettings /></PrivateRoute>} />
                <Route path="*" element={<PrivateRoute><UserHeader /><h2>Pagina niet gevonden</h2></PrivateRoute>} />

                {/* Protected Admin Routes */}
                <Route path="/planning-beheer" element={<PrivateRoute adminOnly={true}><AdminHeader /><AdminLessonPlanning /></PrivateRoute>} />
                <Route path="/gallerij-beheer" element={<PrivateRoute adminOnly={true}><AdminHeader /><AdminGalleryManager /></PrivateRoute>} />
                <Route path="/account-beheer" element={<PrivateRoute adminOnly={true}><AdminHeader /><AdminAcountManager /></PrivateRoute>} />
            </Routes>
        </>
    )
}

export default App;