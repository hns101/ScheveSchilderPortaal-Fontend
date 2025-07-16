import './App.css'
import {Navigate, Route, Routes} from "react-router-dom";
import UserLessonPlanning from "./pages/LessonPlanning/UserLessonPlanning/UserLessonPlanning.jsx";
import AdminLessonPlanning from "./pages/LessonPlanning/AdminLessonPlanning/AdminLessonPlanning.jsx";
import UserGallery from "./pages/UserGallery/UserGallery.jsx";
import UserSettings from "./pages/UserSettings/UserSettings.jsx";
import Login from "./pages/Login/Login.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminGalleryManager from "./pages/AdminGalleryManager/AdminGalleryManager.jsx";
import AdminAcountManager from "./pages/AdminAcountManager/AdminAcountManager.jsx";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword/ResetPassword.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import PublicGalleries from "./pages/PublicGalleries/PublicGalleries.jsx";
import PublicGalleryDetail from "./pages/PublicGalleryDetail/PublicGalleryDetail.jsx";
import MainLayout from "./components/Layout/MainLayout.jsx";
import CollectionEditor from "./pages/CollectionEditor/CollectionEditor.jsx"; // Import the new component

function App() {

    return (
        <>
            <Routes>
                {/* Routes that should NEVER have a header */}
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                {/* All other pages are children of MainLayout and will get a header */}
                <Route path="/" element={<MainLayout />}>
                    {/* Public pages that get a header */}
                    <Route path="galleries" element={<PublicGalleries />} />
                    <Route path="gallery/:studentId" element={<PublicGalleryDetail />} />

                    {/* Protected User Routes */}
                    <Route path="planning" element={<PrivateRoute><UserLessonPlanning /></PrivateRoute>} />
                    <Route path="gallerij" element={<PrivateRoute><UserGallery /></PrivateRoute>} />
                    <Route path="settings" element={<PrivateRoute><UserSettings /></PrivateRoute>} />

                    {/* Protected Admin Routes */}
                    <Route path="planning-beheer" element={<PrivateRoute adminOnly={true}><AdminLessonPlanning /></PrivateRoute>} />
                    <Route path="gallerij-beheer" element={<PrivateRoute adminOnly={true}><AdminGalleryManager /></PrivateRoute>} />
                    <Route path="account-beheer" element={<PrivateRoute adminOnly={true}><AdminAcountManager /></PrivateRoute>} />
                    {/* --- NEW ADMIN ROUTE --- */}
                    <Route path="admin/collection-editor/:collectionId" element={<PrivateRoute adminOnly={true}><CollectionEditor /></PrivateRoute>} />


                    {/* The 404 page is now inside the layout, so it gets the correct header */}
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </>
    )
}

export default App;