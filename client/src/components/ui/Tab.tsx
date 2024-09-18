import React, { useState, ReactNode, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Rocket, Radar } from 'lucide-react';

const tabs = [
  { title: 'Deployment', icon: <Rocket className='h-5 w-5' /> },
  { title: 'CodeScan', icon: <Radar className='h-5 w-5' /> },
];

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: '.5rem',
    paddingRight: '.5rem',
  },
  animate: (selected: boolean) => ({
    gap: selected ? '.5rem' : 0,
    paddingLeft: selected ? '1rem' : '.5rem',
    paddingRight: selected ? '1rem' : '.5rem',
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: 'auto', opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = { delay: 0.1, type: 'spring', bounce: 0, duration: 0.35 };

interface TabProps {
  text: string;
  selected: boolean;
  setSelected: (tab: (typeof tabs)[0]) => void;
  children: ReactNode;
  index: number;
}

const Tab = ({ text, selected, setSelected, index, children }: TabProps) => {
  return (
    <motion.button
      variants={buttonVariants}
      initial='initial'
      animate='animate'
      custom={selected}
      onClick={() => setSelected(tabs[index])}
      transition={transition}
      className={`${
        selected
          ? 'bg-primary text-primary-foreground'
          : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
      } relative flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background`}
    >
      {children}
      <AnimatePresence>
        {selected && (
          <motion.span
            variants={spanVariants}
            initial='initial'
            animate='animate'
            exit='exit'
            transition={transition}
            className='overflow-hidden'
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

interface IconTabsProps {
  onTabChange: (tab: (typeof tabs)[0]) => void;
  selectedTab: string;
}

const IconTabs: React.FC<IconTabsProps> = ({ onTabChange, selectedTab }) => {
  const [selected, setSelected] = useState<(typeof tabs)[0]>(
    tabs.find((tab) => tab.title === selectedTab) || tabs[0]
  );

  useEffect(() => {
    const currentTab = tabs.find((tab) => tab.title === selectedTab);
    if (currentTab) {
      setSelected(currentTab);
    }
  }, [selectedTab]);

  const handleTabChange = (tab: (typeof tabs)[0]) => {
    setSelected(tab);
    onTabChange(tab);
  };

  return (
    <div className='mb-8 flex justify-center items-center gap-4 border-b border-border pb-4'>
      {tabs.map((tab, index) => (
        <Tab
          text={tab.title}
          selected={selected === tab}
          setSelected={handleTabChange}
          index={index}
          key={tab.title}
        >
          {tab.icon}
        </Tab>
      ))}
    </div>
  );
};

export default IconTabs;
