'use client';

import { UserButton } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

import { Button } from './ui/button';
import Link from 'next/link';

const NavbarRoutes = () => {
  const pathname = usePathname();

  const isTeacherMode = pathname?.startsWith('/teacher');
  const isChapterMode = pathname?.includes('/chapters');

  return (
    <div className="ml-auto flex items-center gap-x-2">
      <div>
        {isTeacherMode || isChapterMode ? (
          <Link href="/">
            <Button variant="ghost" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href="/teacher/courses">
            <Button variant="ghost" size="sm">
              Teacher Mode
            </Button>
          </Link>
        )}
      </div>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default NavbarRoutes;
