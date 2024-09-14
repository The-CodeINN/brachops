import React from 'react';
import { MenuIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { ModeToggle } from '../global/mode-toggle';

interface TopbarProps {
  onMenuClick: () => void;
  className?: string;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick, className }) => {
  return (
    <header
      className={` container border-b border-border h-14 flex items-center justify-between px-4 ${className}`}
    >
      <div className='flex items-center'>
        <Button
          onClick={onMenuClick}
          variant={'outline'}
          className='text-foreground p-2 rounded-md lg:hidden mr-4'
        >
          <MenuIcon className='h-6 w-6' />
        </Button>
        <div>
          <span className='text-sm font-bold block'>🚀 Good morning, Tom!</span>
          <span className='text-xs block'>{new Date().toDateString()}</span>
        </div>
      </div>
      <ModeToggle />
    </header>
  );
};

export default Topbar;
