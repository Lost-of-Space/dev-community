import { useContext, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../imgs/logo.svg";
import { UserContext } from '../App';
import UserNavigationPanel from "./user-navigation.component";

const Navbar = () => {

  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false)
  const [userNavPanel, setUserNavPanel] = useState(false)

  let navigate = useNavigate();


  const { userAuth, userAuth: { access_token, profile_img } } = useContext(UserContext);

  const handleUserNavPanel = () => {
    setUserNavPanel(currentVal => !currentVal)
  }

  const handleSearch = (e) => {
    let query = e.target.value;

    if (e.keyCode == 13 && query.length) {
      navigate(`/search/${query}`);
    }
  }

  const handleBlur = () => {
    setTimeout(() => {
      setUserNavPanel(false);
    }, 200);
  }

  return (
    <>
      <nav className="navbar z-[100]">

        <Link to="/" className="flex-none w-20">
          <img src={logo} className="w-full select-none" alt="logo" />
        </Link>

        <div className={"absolute bg-white w-full left-0 top-full border-b border-t border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " + (searchBoxVisibility ? "show" : "hide")}>
          <input type="text" placeholder="Search" className="w-full md:w-auto md:pr-6 search-box"
            onKeyDown={handleSearch} maxLength={60} />
          <span className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey icon"></span>
        </div>

        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          <button className="md:hidden w-12 h-12 rounded-full bg-grey relative hover:bg-black/10" onClick={() => setSearchBoxVisibility(currentVal => !currentVal)}>
            <span className="fi fi-rr-search text-xl -mb-1"></span>
          </button>

          <Link to="/editor" className="hidden md:flex h gap-2 link">
            <span className="fi fi-rr-file-edit icon"></span>
            <p>Post</p>
          </Link>

          {
            access_token ?
              <>
                <Link to="/dashboard/notification">
                  <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10">
                    <span className="fi fi-rr-bell text-2xl block mt-1"></span>
                  </button>
                </Link>

                <div className="relative" onClick={handleUserNavPanel} onBlur={handleBlur}>
                  <button className="w-12 h-12 mt-1">
                    <img src={profile_img} alt="profile image" className="w-full object-cover rounded-full" />
                  </button>

                  {
                    userNavPanel ? <UserNavigationPanel />
                      :
                      ""
                  }
                </div>
              </>
              :
              <>
                <Link className="btn-dark py-2" to="/signin">
                  Sign In
                </Link>
                <Link className="btn-light py-2 hidden md:block" to="/signup">
                  Sign Up
                </Link>
              </>
          }

        </div>

      </nav>

      <Outlet />
    </>
  )
}

export default Navbar;