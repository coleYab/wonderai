import type { Place } from './components/trip-map';

export interface TripListItem {
  id: string;
  name: string;
  summary: string;
  city: string;
  theme: string;
  period: string;
  places: Place[];
}

export const trips: TripListItem[] = [];

export function getTripById(id: string) {
  return trips.find((trip) => trip.id === id);
}
