'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
  }
};

const fadeDown = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
  }
};

export default function HeroSection() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    function onClickOutside(e: MouseEvent) {
      if (!menuRef.current) return;
      if (menuRef.current.contains(e.target as Node)) return;
      setMenuOpen(false);
    }

    if (menuOpen) {
      document.addEventListener('keydown', onKey);
      document.addEventListener('click', onClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClickOutside);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <section className='relative w-full overflow-hidden bg-background pb-44 text-sm text-foreground'>
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className='absolute -left-[10%] -top-[20%] h-[50%] w-[50%] rounded-full bg-primary/10 blur-[120px]'
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
          className='absolute -right-[10%] top-[5%] h-[45%] w-[45%] rounded-full bg-primary/8 blur-[100px]'
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.6 }}
          className='absolute bottom-[10%] left-[25%] h-[25%] w-[50%] rounded-full bg-primary/5 blur-[80px]'
        />
      </div>

      <div
        className='pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]'
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}
      />

      <motion.nav
        initial='hidden'
        animate='visible'
        variants={fadeDown}
        className='flex w-full items-center justify-between p-4 md:px-16 lg:px-24 xl:px-32 md:py-6'
      >
        <Link href='#' aria-label='Wonder AI home' className='flex items-center gap-2'>
          <Image
            src='/icon.png'
            alt='Wonder AI'
            width={28}
            height={28}
            className='size-7 object-contain'
          />
          <span className='text-base font-semibold tracking-tight text-foreground'>
            Wonder AI
          </span>
        </Link>

        <div
          id='menu'
          ref={menuRef}
          className={[
            'max-md:absolute max-md:top-0 max-md:left-0 max-md:h-full max-md:overflow-hidden max-md:bg-background/90 max-md:backdrop-blur max-md:transition-all max-md:duration-300',
            'flex items-center font-medium',
            'max-md:flex-col max-md:justify-center',
            menuOpen ? 'max-md:w-full' : 'max-md:w-0'
          ].join(' ')}
        >
          <button
            onClick={() => setMenuOpen(false)}
            className='md:hidden aspect-square rounded-md bg-primary p-2 font-medium text-primary-foreground transition hover:opacity-90'
            aria-label='Close menu'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              aria-hidden
            >
              <path d='M18 6 6 18' />
              <path d='m6 6 12 12' />
            </svg>
          </button>
        </div>

        <Link
          href='/auth/sign-in'
          className='hidden rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90 md:block'
        >
          Sign In
        </Link>

        <button
          id='open-menu'
          onClick={() => setMenuOpen(true)}
          className='md:hidden aspect-square rounded-md bg-primary p-2 font-medium text-primary-foreground transition hover:opacity-90'
          aria-label='Open menu'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            aria-hidden
          >
            <path d='M4 12h16' />
            <path d='M4 18h16' />
            <path d='M4 6h16' />
          </svg>
        </button>
      </motion.nav>

      <motion.div
        initial='hidden'
        animate='visible'
        variants={stagger}
        className='relative z-10'
      >
        <motion.div variants={scaleIn} className='mx-auto mt-40 flex w-max items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 md:mt-32'>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            The AI Journey Planner is here
          </motion.span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className='mx-auto mt-8 max-w-[850px] text-center text-4xl font-medium md:text-7xl'
        >
          The AI Journey Planner
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className='mx-auto mt-6 max-w-2xl px-2 text-center text-sm text-muted-foreground md:px-0 md:text-base'
        >
          A visually intelligent, self-updating travel assistant designed for modern
          hospitality experiences. Transform travel from a static checklist into a
          living, guided experience.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className='mx-auto mt-8 flex w-full items-center justify-center gap-3'
        >
          <Link
            href='/auth/sign-up'
            className='rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90'
          >
            Sign Up
          </Link>
          <Link
            href='/dashboard'
            className='flex items-center gap-2 rounded-full border border-border px-6 py-3 transition hover:bg-muted'
          >
            <span>Start Planning</span>
            <svg
              width='6'
              height='8'
              viewBox='0 0 6 8'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              aria-hidden
            >
              <path
                d='M1.25.5 4.75 4l-3.5 3.5'
                stroke='currentColor'
                strokeOpacity='.4'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
