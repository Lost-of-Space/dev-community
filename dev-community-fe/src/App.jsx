import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.component";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Navbar />}>
                <Route path="signin" element={<h1>Sign In page</h1>} />
                <Route path="signup" element={<h1>Sign Up page</h1>} />
            </Route>
        </Routes>
    )
}
/* 1:02:30 */
export default App;