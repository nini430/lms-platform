import Navbar from "./_components/navbar";
import Sidebar from "./_components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="h-full">
    <div className="w-full h-[80px] fixed md:pl-6 z-50">
      <Navbar/>
    </div>
    <div className="hidden md:flex h-full w-56 flex-col fixed z-50">
    <Sidebar/>
    </div>
    <main className="h-full pt-[80px] md:pl-56">
    {children}
    </main>
   
    </div>;
};

export default DashboardLayout;
