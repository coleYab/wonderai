'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';

interface JourneyStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  bestPractice: string;
  impact: string;
  image: string;
}

const journeySteps: JourneyStep[] = [
  {
    id: '1/5',
    title: 'The Interactive Discovery',
    subtitle: 'Tell us a little. Get a smart plan fast.',
    description:
      'A guided flow captures dates, budget, interests, and must-see places. In moments, it builds a clean itinerary you can trust.',
    highlights: [
      'Simple step-by-step questions',
      'Live progress while your plan is built',
      'Quick review before finalizing'
    ],
    bestPractice: 'Show why each recommendation was picked.',
    impact: 'Planning feels personal, calm, and premium.',
    image: '/images/chaty.png'
  },
  {
    id: '2/5',
    title: 'The Visual Roadmap',
    subtitle: 'See your day, not just a list.',
    description:
      'Your itinerary appears as a synced list and map. Tap any stop and jump there instantly with a smooth camera move.',
    highlights: [
      'List and map always stay in sync',
      'Clear route lines and stop order',
      'Play My Day auto-preview'
    ],
    bestPractice: 'Use color tags and time-conflict alerts.',
    impact: 'Guests understand their day at a glance.',
    image: '/images/maps.png'
  },
  {
    id: '3/5',
    title: 'The Live Interaction',
    subtitle: 'Your plan comes alive in real time.',
    description:
      'Start your journey once, and the assistant takes over. It syncs to your calendar and helps you at the right moment.',
    highlights: [
      'One-tap start',
      'Google and Apple Calendar sync',
      'Location-based prompts on arrival'
    ],
    bestPractice: 'Add travel buffers between stops.',
    impact: 'The planner supports guests throughout the day.',
    image: '/images/tripp2.png'
  },
  {
    id: '4/5',
    title: 'The Reward Loop',
    subtitle: 'Explore more. Earn more.',
    description:
      'Each completed stop earns coins. Guests redeem perks, upgrades, and surprise rewards as they move through the plan.',
    highlights: [
      'Coins for completed stops',
      'Perks, discounts, and surprise bonuses',
      'Tier journey from Explorer to VIP'
    ],
    bestPractice: 'Add streak bonuses for full-day completion.',
    impact: 'Guests stay engaged and discover more.',
    image: '/images/rewards.png'
  },
  {
    id: '5/5',
    title: 'The Autonomous Journey Planner',
    subtitle: 'A concierge experience in your pocket.',
    description:
      'Planning, navigation, and live guidance work together in one seamless flow. Guests enjoy more and stress less.',
    highlights: [
      'Personalized from start to finish',
      'Clear plans for smoother operations',
      'Dynamic journeys instead of static checklists'
    ],
    bestPractice: 'Track activation, completion, and redemptions.',
    impact: 'Every trip feels thoughtful and effortless.',
    image: '/images/wonder1.png'
  }
];

const projectImages = [
  { title: 'Journey Scene 1', src: '/images/1.jpg' },
  { title: 'Journey Scene 2', src: '/images/2.jpg' },
  { title: 'Journey Scene 3', src: '/images/3.jpg' },
  { title: 'Journey Scene 4', src: '/images/4.jpg' },
  { title: 'Journey Scene 5', src: '/images/5.jpg' }
];

function JourneyStepCard({
  step,
  index,
  progress
}: {
  step: JourneyStep;
  index: number;
  progress: MotionValue<number>;
}) {
  const scale = useTransform(progress, [index * 0.18, 1], [1, 0.96]);

  return (
    <div className='sticky top-0 flex min-h-[600px] items-center bg-background '>
      <motion.article
        style={{ scale }}
        className='mx-auto grid min-h-[620px] gap-4  w-[min(80%,1700px)] overflow-hidden rounded-3xl border border-border bg-card shadow-[0_20px_80px_rgba(0,0,0,0.08)] md:grid-cols-2'
      >
        <div className='flex items-center px-6 py-14 sm:px-10 lg:px-20'>
          <div className='max-w-[680px]'>
            <span className='inline-flex items-center rounded-full border border-primary/60 bg-primary/10 px-3 py-1 text-2xl font-medium tracking-tight text-primary sm:text-3xl'>
              {step.id}
            </span>

            <h2 className='mt-8 text-4xl font-semibold leading-[1.05] text-foreground sm:text-5xl lg:text-6xl'>
              {step.title}
            </h2>
            {/* <p className='mt-4 text-xl font-medium text-muted-foreground sm:text-2xl'>{step.subtitle}</p> */}

            <p className='mt-8 text-base leading-relaxed text-muted-foreground sm:text-lg'>
              {step.description}
            </p>

            {/* <ul className='mt-6 space-y-2 text-sm text-muted-foreground sm:text-base'>
              {step.highlights.map((item) => (
                <li key={item} className='flex items-start gap-2'>
                  <span className='mt-[0.45rem] h-1.5 w-1.5 rounded-full bg-primary' />
                  <span>{item}</span>
                </li>
              ))}
            </ul> */}

            {/* <p className='mt-6 text-sm font-medium text-muted-foreground sm:text-base'>Best Practice: {step.bestPractice}</p> */}
            {/* <p className='mt-3 text-sm font-semibold text-foreground sm:text-base'>Why this matters: {step.impact}</p> */}
          </div>
        </div>

        <div className='relative min-h-[420px] overflow-hidden'>
          <Image src={step.image} alt={step.title} fill className='object-cover object-center' />
          <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent' />
        </div>
      </motion.article>
    </div>
  );
}

const StickyCard_001 = ({
  i,
  title,
  src,
  progress,
  range,
  targetScale
}: {
  i: number;
  title: string;
  src: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}) => {
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div className='sticky top-0 flex items-center justify-center px-4 sm:px-6 lg:px-8'>
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 15 + 200}px)`
        }}
        className='relative -top-1/4 flex h-[220px] w-[80%] max-w-[560px] origin-top flex-col overflow-hidden rounded-3xl border border-border bg-card sm:h-[260px] md:h-[300px]'
      >
        <Image src={src} alt={title} fill className='object-cover' />
      </motion.div>
    </div>
  );
};

const PreviousScrollAnimation = () => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  });

  return (
    <section className='w-full bg-background py-16'>
      <div className='mx-auto max-w-6xl px-4 text-center sm:px-6'>
        <h3 className='text-3xl font-semibold text-foreground sm:text-4xl'>
          Visual Journey Highlights
        </h3>
        <p className='mt-3 text-sm text-muted-foreground sm:text-base'>
          A quick visual pass through your journey flow.
        </p>
      </div>

      <main
        ref={container}
        className='relative mt-6 flex w-full flex-col items-center justify-center pb-[50vh] pt-[5vh] sm:pb-[60vh] sm:pt-[8vh] lg:pb-[70vh] lg:pt-[10vh]'
      >
        {projectImages.map((project, i) => {
          const targetScale = Math.max(0.6, 1 - (projectImages.length - i - 1) * 0.08);
          return (
            <StickyCard_001
              key={`p_${i}`}
              i={i}
              {...project}
              progress={scrollYProgress}
              range={[i * 0.2, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </main>
    </section>
  );
};

const ImagesScrollingAnimation = () => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start']
  });

  return (
    <section ref={container} className='w-full'>
      <div className='relative'>
        {journeySteps.map((step, index) => (
          <JourneyStepCard key={step.id} step={step} index={index} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
};

export { ImagesScrollingAnimation, StickyCard_001 };
