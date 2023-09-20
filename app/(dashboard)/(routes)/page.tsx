import { UserButton } from "@clerk/nextjs";

const DashboardPage = () => {
    return ( 
        <UserButton afterSignOutUrl="/"/>
     );
}
 
export default DashboardPage;