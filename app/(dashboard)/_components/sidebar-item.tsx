import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
}

const SidebarItem = ({ label, href, icon: Icon }: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const onClick=()=>{
    router.push(href);
  }

  const isActive =
    (pathname === '/' && href === '/') ||
    pathname === href ||
    pathname.startsWith(`${href}/`);
  return (
    <button
        onClick={onClick}
      type="button"
      className={cn(
        'w-full flex py-4 pl-6 items-center gap-x-2 text-slate-500 transition-all text bg-slate-300/20 hover:bg-sky-200/20 hover:text-sky-500 font-medium',
        isActive && 'bg-sky-200/20 text-sky-700'
      )}
    >
        <div className='flex items-center gap-x-2'>
        <Icon className={cn('text-slate-500 bg-slate-300/30 transition-all hover:bg-sky-200/20 hover:text-sky-700',isActive && 'text-sky-700 bg-sky-200/20')} size={22}/>
        {label}
        </div>
        <div className={cn('ml-auto h-full  opacity-0 border-2 border-sky-700',isActive && 'opacity-100')}/>
    </button>
  );
};

export default SidebarItem;
