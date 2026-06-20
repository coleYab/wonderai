'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className='flex w-full flex-col items-center justify-around border-t border-border bg-muted/40 py-16 text-sm text-muted-foreground'
    >
      <Link href='#' className='flex items-center gap-2'>
        <Image
          src='/icon.png'
          alt='Wonder AI'
          width={32}
          height={32}
          className='size-8 object-contain'
        />
        <span className='text-lg font-semibold tracking-tight text-foreground'>
          Wonder AI
        </span>
      </Link>
      <p className='mt-4 text-center'>
        Copyright &copy; {new Date().getFullYear()} All rights reserved.
      </p>
    </motion.footer>
  );
}
