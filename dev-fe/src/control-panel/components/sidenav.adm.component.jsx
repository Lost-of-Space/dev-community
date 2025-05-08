import { useContext, useEffect, useRef, useState } from "react";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import { UserContext } from "../../App";
import PageNotFound from "../../pages/404.page";

const AdmNavbar = () => {

  let { userAuth: { access_token, isAdmin } } = useContext(UserContext);

  let page = location.pathname.split("/")[2];

  let [pageState, setPageState] = useState(page ? page.replace('-', ' ') : '');
  let [showSideNav, setShowSideNav] = useState(false);

  let activeTabLine = useRef();
  let sidebarTabIcon = useRef();
  let pageStateTab = useRef();

  const changePageState = (e) => {
    let { offsetWidth, offsetLeft } = e.target;

    activeTabLine.current.style.width = offsetWidth + "px";
    activeTabLine.current.style.left = offsetLeft + "px";

    if (e.target == sidebarTabIcon.current) {
      setShowSideNav(true);
    } else {
      setShowSideNav(false);
    }
  }

  const updateActiveTabLine = (element) => {
    if (element && activeTabLine.current) {
      let { offsetWidth, offsetLeft } = element;
      activeTabLine.current.style.width = offsetWidth + "px";
      activeTabLine.current.style.left = offsetLeft + "px";
    }
  }

  useEffect(() => {
    setShowSideNav(false);
    if (pageStateTab.current) {
      updateActiveTabLine(pageStateTab.current);
    }
  }, [pageState])

  return (
    !isAdmin ? <PageNotFound /> :
      access_token === null ? <Navigate to="/signin" />
        :
        <>
          <section className="relative flex gap-10 py-0 m-0 max-md:flex-col">

            <div className="sticky top-[80px] z-30">

              <div className="md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto">
                <button ref={sidebarTabIcon} onClick={changePageState} className="p-5 capitalize">
                  <span className="fi fi-rr-bars-staggered icon pointer-events-none"></span>
                </button>

                <button ref={pageStateTab} onClick={changePageState} className="p-5 capitalize">
                  {pageState}
                </button>
                <hr ref={activeTabLine} className="absolute bottom-0 duration-500" />
              </div>

              <div className={"min-w-[200px] h-[calc(100vh-80px-60px)] md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500 " + (!showSideNav ? "max-md:opacity-0 max-md:pointer-events-none" : "opacity-100 pointer-events-auto")}>
                <h1 className="text-xl text-dark-grey mb-3">Control Panel</h1>
                <hr className="border-grey -ml-6 mb-8 mr-6" />

                <NavLink to="/admin/users" onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
                  <span className="fi fi-rr-user icon"></span>
                  Users
                </NavLink>

                <NavLink to="/admin/posts" onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
                  <span className="fi fi-rr-document icon"></span>
                  Posts
                </NavLink>

                <h1 className="text-xl text-dark-grey mt-20 mb-3">Statistics</h1>
                <hr className="border-grey -ml-6 mb-8 mr-6" />

                <NavLink to="/admin/user-statistics" onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
                  <span className="fi fi-rr-chart-pie icon"></span>
                  Users
                </NavLink>

                <NavLink to="/admin/post-statistics" onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
                  <span className="fi fi-rr-chart-pie icon"></span>
                  Posts
                </NavLink>
              </div>

            </div>

            <div className="max-md:-mt-8 mt-5 w-full">
              <Outlet />
            </div>

          </section>
        </>
  )
}

export default AdmNavbar;