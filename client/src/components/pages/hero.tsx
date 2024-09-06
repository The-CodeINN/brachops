import { ArrowRightIcon } from '@radix-ui/react-icons';
import AnimatedGradientText from '../ui/animated-gradient-text';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <>
      <section
        id='hero'
        className='relative mx-auto min-h-screen flex justify-center flex-col max-w-7xl px-6 text-center md:px-8'
      >
        <Link to='/'>
          <AnimatedGradientText>
            🎉 <hr className='mx-2 h-4 w-[1px] shrink-0 bg-gray-300' />
            <span
              className={cn(
                `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
              )}
            >
              Introducing BrachOps
            </span>
            <ChevronRight className='ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5' />
          </AnimatedGradientText>
        </Link>
        <h1 className='animate-fade-in -translate-y-4 text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text py-6 text-5xl font-semibold leading-none tracking-tighter text-transparent opacity-0 [--animation-delay:200ms] sm:text-6xl md:text-7xl lg:text-8xl dark:from-white dark:to-white/40'>
          Effortless Deployment.
          <br className='hidden md:block' /> Unparalleled Scale.
        </h1>
        <p className='animate-fade-in mb-12 -translate-y-4 text-balance text-lg tracking-tight text-gray-400 opacity-0 [--animation-delay:400ms] md:text-xl'>
          Unleash the power of your application with our cutting-edge deployment
          platform.
          <br className='hidden md:block' /> Streamline your workflow and focus
          on innovation.
        </p>
        <div className='flex flex-col md:flex-row justify-center w-full'>
          <Link to='/create-deployment'>
            <Button className='animate-fade-in -translate-y-4 gap-1 text-white opacity-0 ease-in-out [--animation-delay:600ms] dark:text-black'>
              <span>Deploy Now </span>
              <ArrowRightIcon className='ml-1 size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1' />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}

export { Hero };
