'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { type TripListItem } from '@/features/trips/data';
import { DEFAULT_TRIP_PLACES } from '@/features/trips/constants/default-places';
import {
  readStoredTrips,
  saveStoredTrips,
  type ConciergeSelections,
  type StoredCustomTrip
} from '@/features/trips/lib/custom-trips-storage';

type ConciergeStep = {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Icons;
  options: string[];
  multiple: boolean;
};

const STEPS: ConciergeStep[] = [
  {
    id: 'logistics_dates',
    title: 'Dates & Duration',
    subtitle: 'When are we escaping, and how long are we staying?',
    icon: 'calendar',
    options: ['This Weekend', 'Next Week', 'Specific Dates Later'],
    multiple: false
  },
  {
    id: 'logistics_party',
    title: 'The Travel Party',
    subtitle: 'Who is joining this journey?',
    icon: 'teams',
    options: ['Solo Explorer', 'Romantic Couple', 'Family with Kids', 'Friend Group'],
    multiple: false
  },
  {
    id: 'logistics_basecamp',
    title: 'The Basecamp',
    subtitle: 'Which Kuriftu sanctuary is your home base?',
    icon: 'mapPin',
    options: ['Kuriftu Bishoftu', 'Kuriftu Awash', 'Kuriftu Lake Tana', 'Kuriftu Entoto'],
    multiple: false
  },
  {
    id: 'logistics_timing',
    title: 'Arrival & Departure',
    subtitle: 'When do you land and when is your departure?',
    icon: 'clock',
    options: ['Morning Arrival', 'Afternoon Arrival', 'Evening Arrival', 'Late Night'],
    multiple: true
  },
  {
    id: 'finances_budget',
    title: 'Daily Spending',
    subtitle: 'Excluding accommodation, what ETB range fits your daily spending?',
    icon: 'wallet',
    options: [
      '<10,000 ETB',
      '10,000 - 25,000 ETB',
      '25,000 - 50,000 ETB',
      '50,000 - 100,000 ETB',
      '100,000+ ETB'
    ],
    multiple: false
  },
  {
    id: 'interests_goal',
    title: 'The Primary Goal',
    subtitle: 'What is the main intention of this trip?',
    icon: 'compass',
    options: ['Relaxation', 'Cultural Immersion', 'Adventure', 'Culinary Discovery'],
    multiple: false
  },
  {
    id: 'dining_boundaries',
    title: 'Culinary Boundaries',
    subtitle: 'Any dietary restrictions or preferences?',
    icon: 'pizza',
    options: ['No Restrictions', 'Vegan/Vegetarian', 'Gluten-Free', 'Halal/Kosher', 'No Seafood'],
    multiple: true
  }
];

const BASECAMPS = {
  'Kuriftu Bishoftu': {
    city: 'Bishoftu',
    theme: 'Lakeside',
    category: 'Lakeside Resort',
    lng: 38.9798,
    lat: 8.7527,
    image: '/images/1.jpg'
  },
  'Kuriftu Awash': {
    city: 'Awash',
    theme: 'Riverside',
    category: 'Riverside Resort',
    lng: 40.1705,
    lat: 8.976,
    image: '/images/7.jpg'
  },
  'Kuriftu Lake Tana': {
    city: 'Bahir Dar',
    theme: 'Lakefront',
    category: 'Lakefront Resort',
    lng: 37.3957,
    lat: 11.6006,
    image: '/images/2.jpg'
  },
  'Kuriftu Entoto': {
    city: 'Addis Ababa',
    theme: 'Highland',
    category: 'Mountain Retreat',
    lng: 38.7617,
    lat: 9.0701,
    image: '/images/5.jpg'
  }
} satisfies Record<
  string,
  {
    city: string;
    theme: string;
    category: string;
    lng: number;
    lat: number;
    image: string;
  }
>;

function mapGoalToTheme(goal: string): string {
  if (goal === 'Adventure') return 'Adventure';
  if (goal === 'Cultural Immersion') return 'Cultural';
  if (goal === 'Culinary Discovery') return 'Food';
  return 'Relaxed';
}

function getSingle(selections: ConciergeSelections, key: string): string {
  return selections[key]?.[0] ?? '';
}

export function TripsDashboardClient() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<ConciergeSelections>({});
  const [finalNotes, setFinalNotes] = useState('');
  const [customTrips, setCustomTrips] = useState<StoredCustomTrip[]>(() => readStoredTrips());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const isNotesStep = currentStep >= STEPS.length;
  const activeStep = isNotesStep ? null : STEPS[currentStep];
  const ActiveStepIcon = activeStep ? Icons[activeStep.icon] : null;
  const totalSteps = STEPS.length + 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const trips = useMemo(() => {
    const localTrips = customTrips.map((item) => item.trip);
    return localTrips;
  }, [customTrips]);

  const resetFlow = () => {
    setCurrentStep(0);
    setSelections({});
    setFinalNotes('');
    setGenerationError(null);
  };

  const handleSelect = (option: string) => {
    if (!activeStep) return;

    const currentSelections = selections[activeStep.id] || [];

    if (activeStep.multiple) {
      const nextSelections = currentSelections.includes(option)
        ? currentSelections.filter((item) => item !== option)
        : [...currentSelections, option];

      setSelections((prev) => ({
        ...prev,
        [activeStep.id]: nextSelections
      }));
      return;
    }

    setSelections((prev) => ({
      ...prev,
      [activeStep.id]: [option]
    }));
  };

  const canContinue = isNotesStep ? true : Boolean(selections[activeStep?.id ?? '']?.length);

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleContinue = async () => {
    if (!canContinue) return;

    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch('/api/trips/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          preferences: selections,
          notes: finalNotes
        })
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(errorData?.error || 'Trip generation failed. Please try again.');
      }

      const payload = (await response.json()) as {
        name?: string;
        summary?: string;
        places?: TripListItem['places'];
      };

      const now = new Date();
      const tripGoal = getSingle(selections, 'interests_goal') || 'Relaxation';
      const basecampName = getSingle(selections, 'logistics_basecamp') || 'Kuriftu Bishoftu';
      const basecamp =
        basecampName in BASECAMPS
          ? BASECAMPS[basecampName as keyof typeof BASECAMPS]
          : BASECAMPS['Kuriftu Bishoftu'];
      const travelDates = getSingle(selections, 'logistics_dates') || 'Specific Dates Later';

      const resolvedPlaces =
        payload.places && payload.places.length > 0
          ? payload.places
          : DEFAULT_TRIP_PLACES.slice(0, 4);

      const newTrip: TripListItem = {
        id: `custom-${now.getTime()}`,
        name: payload.name || `${basecamp.city} Concierge Journey`,
        summary: payload.summary || 'Personalized itinerary generated by Gemini concierge.',
        city: resolvedPlaces[0]?.city || basecamp.city,
        theme: mapGoalToTheme(tripGoal),
        period: travelDates,
        places: resolvedPlaces
      };

      const storedTrip: StoredCustomTrip = {
        trip: newTrip,
        answers: selections,
        notes: finalNotes.trim(),
        createdAt: new Date().toISOString()
      };

      setCustomTrips((prev) => {
        const next = [storedTrip, ...prev];
        saveStoredTrips(next);
        return next;
      });

      setIsOpen(false);
      resetFlow();
      router.push(`/dashboard/trips/${newTrip.id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Trip generation failed. Please try again.';
      setGenerationError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const openDialog = (nextOpen: boolean) => {
    setIsOpen(nextOpen);
    if (!nextOpen) {
      resetFlow();
    }
  };

  return (
    <div className='mx-auto w-full max-w-6xl space-y-6'>
      {trips.length > 0 ? (
        <div className='flex justify-end'>
          <Button className='gap-2' onClick={() => setIsOpen(true)}>
            <Icons.add />
            Create Trip
          </Button>
        </div>
      ) : null}

      <Dialog open={isOpen} onOpenChange={openDialog}>
        <DialogContent className='max-h-[90dvh] overflow-y-auto sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Create a new trip</DialogTitle>
            <DialogDescription>
              Answer each step to generate a trip draft. Your draft is saved locally in this
              browser.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='flex items-center justify-between text-xs text-muted-foreground'>
              <span>
                Step {currentStep + 1} of {totalSteps}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />

            {isNotesStep ? (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-base'>
                    <Icons.sparkles className='h-4 w-4' />
                    Final Notes
                  </CardTitle>
                  <CardDescription>
                    Optional: add extra context, requests, or accessibility preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={finalNotes}
                    onChange={(event) => setFinalNotes(event.target.value)}
                    rows={6}
                    placeholder='Example: We want a surprise anniversary dinner and minimal walking.'
                  />

                  {generationError ? (
                    <p className='mt-3 text-xs text-red-500'>{generationError}</p>
                  ) : null}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-base'>
                    {ActiveStepIcon ? <ActiveStepIcon className='h-4 w-4' /> : null}
                    {activeStep?.title}
                  </CardTitle>
                  <CardDescription>{activeStep?.subtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='grid gap-2 sm:grid-cols-2'>
                    {activeStep?.options.map((option) => {
                      const selected = Boolean(selections[activeStep.id]?.includes(option));

                      return (
                        <div
                          key={option}
                          role='button'
                          tabIndex={0}
                          onClick={() => handleSelect(option)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              handleSelect(option);
                            }
                          }}
                          className={cn(
                            'flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none',
                            selected
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'hover:bg-accent hover:text-accent-foreground'
                          )}
                        >
                          <span>{option}</span>
                          {activeStep.multiple ? (
                            <Checkbox checked={selected} className='pointer-events-none' />
                          ) : selected ? (
                            <Icons.check className='h-4 w-4' />
                          ) : null}
                        </div>
                      );
                    })}
                  </div>

                  {activeStep?.multiple ? (
                    <p className='text-muted-foreground mt-3 text-xs'>
                      You can select multiple options.
                    </p>
                  ) : null}

                  {generationError ? (
                    <p className='mt-3 text-xs text-red-500'>{generationError}</p>
                  ) : null}
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={handleBack}
              disabled={currentStep === 0 || isGenerating}
            >
              Back
            </Button>
            <Button
              type='button'
              onClick={handleContinue}
              disabled={!canContinue || isGenerating}
              isLoading={isGenerating}
            >
              {isNotesStep ? 'Create Trip' : 'Continue'}
              <Icons.arrowRight className='h-4 w-4' />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {trips.length > 0 ? (
        <div className='grid gap-4 md:grid-cols-2'>
          {trips.map((trip) => {
            return (
              <Link key={trip.id} href={`/dashboard/trips/${trip.id}`}>
                <Card className='h-full transition hover:border-primary/40 hover:bg-accent/30'>
                  <CardHeader>
                    <div className='flex items-center justify-between gap-3'>
                      <div>
                        <CardTitle className='text-xl'>{trip.name}</CardTitle>
                        <CardDescription className='mt-1'>{trip.summary}</CardDescription>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Badge variant='outline'>{trip.places.length} stops</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='flex flex-wrap gap-2'>
                      <Badge>{trip.city}</Badge>
                      <Badge variant='secondary'>{trip.theme}</Badge>
                    </div>
                    <div className='flex items-center justify-between text-sm text-muted-foreground'>
                      <span>{trip.period}</span>
                      <span className='inline-flex items-center gap-1'>
                        Open map <Icons.arrowRight className='h-4 w-4' />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className='border-none py-10'>
          <div className='text-center space-y-4'>
            <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted'>
              <Icons.mapPin className='h-6 w-6 text-muted-foreground' />
            </div>

            <div className='text-lg font-semibold'>No trips yet</div>

            <div className='text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed'>
              Start planning your first journey. Your trips will appear here once created.
            </div>
          </div>

          <div className='flex flex-col items-center gap-4 mt-6'>
            <Button className='gap-2 px-6' onClick={() => setIsOpen(true)}>
              <Icons.add className='h-4 w-4' />
              Create Trip
            </Button>
          </div>
        </div>
      )}

      {trips.length > 0 ? (
        <div className='flex justify-center'>
          <Button variant='secondary' asChild>
            <Link href={`/dashboard/trips/${trips[0].id}`}>Open first trip</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
