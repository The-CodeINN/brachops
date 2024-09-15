import { LucideIcon } from 'lucide-react';
import { Button, ButtonProps } from '../ui/button';
import { cn } from '@/lib/utils';

interface SidebarButtonProps extends ButtonProps {
  icon?: LucideIcon;
  isActive?: boolean;
}

const SidebarButton = ({
  icon: Icon,
  className,
  children,
  isActive,
  ...props
}: SidebarButtonProps) => {
  return (
    <Button
      variant={isActive ? 'secondary' : 'ghost'}
      className={cn(
        'gap-2 justify-start',
        isActive ? 'text-primary font-bold' : '',
        className
      )}
      {...props}
    >
      {Icon && <Icon size={20} />}
      <span>{children}</span>
    </Button>
  );
};

export default SidebarButton;
