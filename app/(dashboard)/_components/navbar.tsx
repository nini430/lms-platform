import NavbarRoutes from "@/components/navbar-routes";
import MobileSidebar from "./mobile-sidebar";

const Navbar = () => {
    return ( 
        <div className="px-4 h-full flex items-center border-b shadow-sm z-50 bg-white">
            <MobileSidebar/>
            <NavbarRoutes/>
            </div>
     );
}
 
export default Navbar;