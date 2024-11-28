/* pt2( 1:20 ) */

import { lookInSession } from "./common/session";
import { createContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";

export const UserContext = createContext({})

const App = () => {

    const [userAuth, setUserAuth] = useState({});

    useEffect(() => {

        let userInSession = lookInSession("user");

        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null })

    }, [])


    return (
        <UserContext.Provider value={{ userAuth, setUserAuth }}>
            <Routes>
                <Route path="/" element={<Navbar />}>
                    <Route path="signin" element={<UserAuthForm type="sign-in" />} />
                    <Route path="signup" element={<UserAuthForm type="sign-up" />} />
                </Route>
            </Routes>
        </UserContext.Provider>
    )
}

export default App;