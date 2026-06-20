'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className='relative w-full overflow-hidden bg-background px-4 py-32 md:px-16 lg:px-24 xl:px-32'>
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='absolute left-1/2 top-1/2 h-[60%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]' />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className='relative z-10 mx-auto max-w-3xl text-center'
      >
        <h2 className='text-3xl font-semibold text-foreground sm:text-5xl'>
          Ready to transform your travel experience?
        </h2>
        <p className='mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base'>
          Start planning your next adventure with an AI companion that understands
          your preferences and guides you every step of the way.
        </p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='mt-8 flex items-center justify-center gap-3'
        >
          <Link
            href='/auth/sign-up'
            className='rounded-full bg-primary px-8 py-3.5 font-medium text-primary-foreground transition hover:opacity-90'
          >
            Get Started Free
          </Link>
          <Link
            href='/dashboard'
            className='rounded-full border border-border px-8 py-3.5 font-medium transition hover:bg-muted'
          >
            Explore Dashboard
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
