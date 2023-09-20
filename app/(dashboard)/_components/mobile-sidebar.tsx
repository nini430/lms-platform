import {Menu} from 'lucide-react'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import Sidebar from './sidebar';

const MobileSidebar = () => {
    return ( 
        <Sheet>
            <SheetTrigger className='md:hidden transition pr-4 hover:opacity-75'>
                <Menu/>
            </SheetTrigger>
            <SheetContent side='left' className='p-0'>
                <Sidebar/>
            </SheetContent>
        </Sheet>
     );
}
 
export default MobileSidebar;