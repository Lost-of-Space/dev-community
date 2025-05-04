/*
Todo:
Add dynamic tag suggestions
Deleting posts by moderators with notification
Add confirmation menu for deleting posts

*/

import { lookInSession } from "./common/session";
import { createContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import Editor from "./pages/editor.pages";
import HomePage from "./pages/home.page";
import SearchPage from "./pages/search.page";
import PageNotFound from "./pages/404.page";
import ProfilePage from "./pages/profile.page";
import PostPage from "./pages/post.page";
import SideNavbar from "./components/sidenavbar.component";
import ChangePasswordPage from "./pages/change-password.page";
import EditProfilePage from "./pages/edit-profile.page";
import NotificationsPage from "./pages/notifications.page";
import ManagePostsPage from "./pages/manage-posts.page";

export const UserContext = createContext({});

export const ThemeContext = createContext({});

const App = () => {

    const [userAuth, setUserAuth] = useState({});

    const [theme, setTheme] = useState("light");

    useEffect(() => {

        let userInSession = lookInSession("user");
        let themeInSession = lookInSession("theme");

        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null });

        if (themeInSession) {
            setTheme(() => {
                document.body.setAttribute('data-theme', themeInSession);

                return themeInSession;
            })
        } else {
            document.body.setAttribute('data-theme', theme);
        }

    }, [])


    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <UserContext.Provider value={{ userAuth, setUserAuth }}>
                <Routes>
                    <Route path="/editor" element={<Editor />} />
                    <Route path="/editor/:post_id" element={<Editor />} />
                    <Route path="/" element={<Navbar />}>
                        <Route index element={<HomePage />} />
                        <Route path="dashboard" element={<SideNavbar />}>
                            <Route path="posts" element={<ManagePostsPage />} />
                            <Route path="notifications" element={<NotificationsPage />} />
                        </Route>
                        <Route path="settings" element={<SideNavbar />}>
                            <Route path="edit-profile" element={<EditProfilePage />} />
                            <Route path="change-password" element={<ChangePasswordPage />} />
                        </Route>
                        <Route path="signin" element={<UserAuthForm type="sign-in" />} />
                        <Route path="signup" element={<UserAuthForm type="sign-up" />} />
                        <Route path="search/:query" element={<SearchPage />} />
                        <Route path="user/:id" element={<ProfilePage />} />
                        <Route path="post/:post_id" element={<PostPage />} />
                        <Route path="*" element={<PageNotFound />} />
                    </Route>
                </Routes>
            </UserContext.Provider>
        </ThemeContext.Provider>
    )
}

export default App;