// hooks/useActiveSection.ts
'use client';

import { useState, useEffect } from 'react';

export function useActiveSection(sectionIds: string[], threshold = 0.3) {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      console.log('Intersection entries:', entries); // Debug log
      
      // Cari entry yang paling visible
      let mostVisibleEntry: IntersectionObserverEntry | null = null;
      
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!mostVisibleEntry || entry.intersectionRatio > mostVisibleEntry.intersectionRatio) {
            mostVisibleEntry = entry;
          }
        }
      });

      if (mostVisibleEntry) {
        console.log('Setting active section:', mostVisibleEntry.target.id); // Debug log
        setActiveSection(mostVisibleEntry.target.id);
      }
    };

    const observerOptions = {
      threshold: [0.1, 0.3, 0.5, 0.7], // Multiple thresholds untuk akurasi lebih baik
      rootMargin: '-100px 0px -100px 0px' // Adjust trigger point
    };

    // Create observers for each section
    sectionIds.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      console.log('Looking for section:', sectionId, 'found:', !!section); // Debug log
      
      if (section) {
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        observer.observe(section);
        observers.push(observer);
      }
    });

    // Cleanup observers
    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [sectionIds]);

  return activeSection;
}