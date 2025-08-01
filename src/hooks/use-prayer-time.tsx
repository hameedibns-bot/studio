
'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { add, sub, format } from 'date-fns';

type PrayerTimes = {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

interface PrayerTimeContextType {
  isPrayerTime: boolean;
  currentPrayer: string | null;
  prayerTimes: PrayerTimes | null;
  error: string | null;
}

const PrayerTimeContext = createContext<PrayerTimeContextType>({
  isPrayerTime: false,
  currentPrayer: null,
  prayerTimes: null,
  error: null,
});

export const usePrayerTime = () => useContext(PrayerTimeContext);

interface PrayerTimeProviderProps {
  children: ReactNode;
}

export const PrayerTimeProvider = ({ children }: PrayerTimeProviderProps) => {
  const [isPrayerTime, setIsPrayerTime] = useState(false);
  const [currentPrayer, setCurrentPrayer] = useState<string | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setError(null);
        },
        () => {
          setError('Could not get your location. Prayer times are based on a default location.');
          setLocation({ latitude: 51.5074, longitude: -0.1278 }); // Default to London
        }
      );
    } else {
      setError('Geolocation is not available. Prayer times are based on a default location.');
      setLocation({ latitude: 51.5074, longitude: -0.1278 }); // Default to London
    }
  }, []);

  useEffect(() => {
    if (!location) return;

    const fetchPrayerTimes = async () => {
      try {
        const date = new Date();
        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity?city=Dubai&country=AE&method=2`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.code === 200) {
            const timings: PrayerTimes = data.data.timings;
            setPrayerTimes(timings);
            setError(null);
        } else {
            throw new Error(data.data || 'Could not fetch prayer times.');
        }

      } catch (e: any) {
        console.error('Failed to fetch prayer times:', e);
        setError(`Could not retrieve prayer times. Please check your connection. ${e.message}`);
      }
    };
    
    fetchPrayerTimes();
    const interval = setInterval(fetchPrayerTimes, 24 * 60 * 60 * 1000); // Refresh daily
    return () => clearInterval(interval);

  }, [location]);

  useEffect(() => {
    if (!prayerTimes) return;

    const checkPrayerTime = () => {
      const now = new Date();
      let prayerInProgress = false;
      let activePrayer = null;

      for (const [name, time] of Object.entries(prayerTimes)) {
        const [hour, minute] = time.split(':').map(Number);
        const prayerTimeToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
        
        const prayerStart = sub(prayerTimeToday, { minutes: 1 }); // Start 1 min before
        const prayerEnd = add(prayerTimeToday, { minutes: 15 });

        if (now >= prayerStart && now <= prayerEnd) {
          prayerInProgress = true;
          activePrayer = name;
          break;
        }
      }

      setIsPrayerTime(prayerInProgress);
      setCurrentPrayer(activePrayer);
    };

    checkPrayerTime();
    const timer = setInterval(checkPrayerTime, 1000 * 30); // Check every 30 seconds

    return () => clearInterval(timer);
  }, [prayerTimes]);

  const value = { isPrayerTime, currentPrayer, prayerTimes, error };

  return (
    <PrayerTimeContext.Provider value={value}>
      {children}
    </PrayerTimeContext.Provider>
  );
};
