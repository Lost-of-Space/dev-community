import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../App";

const AppRouter = ({ children }) => {
  const location = useLocation();
  const { userAuth: { isBlocked } } = useContext(UserContext);

  if (isBlocked && location.pathname !== "/blocked") {
    return <Navigate to="/blocked" replace />;
  }

  return children;
};

export default AppRouter;
