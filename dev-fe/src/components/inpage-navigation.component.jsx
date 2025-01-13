import { useEffect, useRef, useState } from "react";

export let activeTabLineRef;
export let activeTabRef;

const InPageNavigation = ({ routes, defaultHidden = [], defaultIndex = 0, children, panelElements }) => {

  activeTabLineRef = useRef();
  activeTabRef = useRef();

  let [inPageNavIndex, setInPageNavIndex] = useState(defaultIndex);

  const changePageState = (btn, i) => {
    let { offsetWidth, offsetLeft } = btn;

    activeTabLineRef.current.style.width = offsetWidth + "px";
    activeTabLineRef.current.style.left = offsetLeft + "px";

    setInPageNavIndex(i);

  }

  useEffect(() => {
    changePageState(activeTabRef.current, defaultIndex);
  }, [])

  return (
    <>
      <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
        {
          routes.map((route, i) => {
            return (
              <button
                ref={i == defaultIndex ? activeTabRef : null}
                key={i}
                className={
                  "p-3 px-4 capitalize rounded-t-md " +
                  (inPageNavIndex == i ? "text-black font-bold" : "text-dark-grey") +
                  (defaultHidden.includes(route) ? " md:hidden" : "") +
                  " max-w-[350px] truncate"
                }
                onClick={(e) => {
                  changePageState(e.target, i)
                }}
              >
                {route}
              </button>
            )
          })
        }

        <>
          {
            panelElements
          }
        </>

        <hr ref={activeTabLineRef} className="absolute bg-black h-[3px] rounded-t-xl bottom-0 duration-300" />

      </div>

      {Array.isArray(children) ? children[inPageNavIndex] : children}

    </>
  )
}

export default InPageNavigation;