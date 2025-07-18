import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import AdminHeader from '../Headers/AdminHeader.jsx';
import UserHeader from '../Headers/UserHeader.jsx';
import PublicHeader from '../Headers/public/PublicHeader.jsx';

function MainLayout() {
    const { user } = useAuth();
    const location = useLocation();

    const renderHeader = () => {
        // If a user is logged in, always show their role-appropriate header.
        if (user) {
            if (user.roles?.includes("ROLE_ADMIN")) {
                return <AdminHeader />;
            }
            return <UserHeader />;
        }

        // If the user is logged OUT, only show a header on specific public pages.
        const publicPathsWithHeader = ['/galleries', '/gallery','/collection'];
        const isPublicPageWithHeader = publicPathsWithHeader.some(path => location.pathname.startsWith(path));

        if (isPublicPageWithHeader) {
            return <PublicHeader />;
        }

        // For all other logged-out cases (like the /login page), show no header.
        return null;
    };

    return (
        <>
            {renderHeader()}
            <main>
                {/* The <Outlet> renders the actual page component for the current route */}
                <Outlet />
            </main>
        </>
    );
}

export default MainLayout;