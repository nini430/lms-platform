import Sidebar from "./_components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="h-full">
    <div className="hidden md:flex h-full w-56 flex-col fixed z-50">
    <Sidebar/>
    </div>
    <main className="h-full md:pl-56">
    {children}
    </main>
   
    </div>;
};

export default DashboardLayout;