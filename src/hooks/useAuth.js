import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import jwtDecode from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isManager = false;
  let isAdmin = false;
  let isCreator = false;
  let isViewAll = false;
  let isViewer = false;
  let status = "VIEW_ALL";

  if (token) {
    const decoded = jwtDecode(token);
    const { username, roles } = decoded.UserInfo;

    isManager = roles.includes("Manager");
    isAdmin = roles.includes("Admin");
    isCreator = roles.includes("CREATOR");
    isViewAll = roles.includes("VIEW_ALL");
    isViewer = roles.includes("VIEWER");
    if (isManager) status = "Manager";
    if (isAdmin) status = "Admin";
    if (isCreator) status = "Creator";
    if (isViewAll) status = "Viewall";
    if (isViewer) status = "Viewer";
    return {
      username,
      roles,
      status,
      isManager,
      isAdmin,
      isCreator,
      isViewAll,
      isViewer,
    };
  }

  return {
    username: "",
    roles: [],
    isManager,
    isAdmin,
    status,
    isCreator,
    isViewAll,
    isViewer,
  };
};
export default useAuth;
