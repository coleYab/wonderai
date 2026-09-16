'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Icons } from '@/components/icons';

const features = [
  {
    icon: Icons.sparkles,
    title: 'AI-Powered Planning',
    description: 'Tell us your preferences and get a smart, personalized itinerary in moments.'
  },
  {
    icon: Icons.compass,
    title: 'Interactive Maps',
    description: 'Visualize your day with synced list and map views. Navigate with ease.'
  },
  {
    icon: Icons.calendar,
    title: 'Live Guidance',
    description: 'Your plan comes alive with calendar sync and location-based prompts.'
  },
  {
    icon: Icons.wallet,
    title: 'Rewards & Perks',
    description: 'Earn coins, unlock perks, and level up as you explore and complete stops.'
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] }
  })
};

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className='w-full bg-background px-4 py-24 md:px-16 lg:px-24 xl:px-32'>
      <div className='mx-auto max-w-6xl'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='text-center'
        >
          <h2 className='text-3xl font-semibold text-foreground sm:text-4xl'>
            Everything you need to travel better
          </h2>
          <p className='mt-3 text-sm text-muted-foreground sm:text-base'>
            Intelligent tools that transform how you plan, navigate, and experience every journey.
          </p>
        </motion.div>

        <div ref={ref} className='mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              initial='hidden'
              animate={isInView ? 'visible' : 'hidden'}
              variants={cardVariants}
              className='group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/30'
            >
              <div className='flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15'>
                <feature.icon className='size-6' />
              </div>
              <h3 className='mt-5 text-base font-semibold text-foreground'>{feature.title}</h3>
              <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
