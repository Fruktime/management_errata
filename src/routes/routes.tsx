
// import PackageCpeList from "../pages/PackageCpeList";
// import ErrataList from "../pages/ErrataList";
// import Home from "../pages/Home";
import {ReactElement} from "react";
import LoginPageHideShowPassword from "../views/Login";
import Home from "../views/Home";


interface Routes {
    path: string;
    element: ReactElement;
}

export const privateRoutes = [
    // {path: '/packages-cpe', element: <PackageCpeList />, exact: true},
    // {path: '/errata', element: <ErrataList />, exact: true},
    {path: '/', element: <Home />},
]

export const publicRoutes: Routes[] = [
    { path: '/login', element: <LoginPageHideShowPassword />},
]
