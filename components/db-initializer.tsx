'use client'

import { useEffect } from 'react'

export function DbInitializer() {
  useEffect(() => {
    // This component runs on the client side and initializes
    // the database by copying data from JSON files to localStorage
    // if localStorage is empty
    
    const initializeLocalStorageFromDB = async () => {
      // List of entities to check and initialize
      const entities = ['clients', 'vehicles', 'parts', 'contracts', 'maintenances', 'leases'];
      
      for (const entity of entities) {
        try {
          // Check if localStorage already has data for this entity
          const localStorageData = localStorage.getItem(entity);
          
          // Only initialize if localStorage is truly empty or null
          if (!localStorageData) {
            console.log(`Initializing ${entity} from DB data`);
            const response = await fetch(`/api/db?entity=${entity}`);
            if (response.ok) {
              const dbData = await response.json();
              // If DB has data, save it to localStorage
              if (dbData && Array.isArray(dbData) && dbData.length > 0) {
                localStorage.setItem(entity, JSON.stringify(dbData));
                console.log(`Initialized ${entity} in localStorage with ${dbData.length} records from DB data`);
              } else if (dbData && Array.isArray(dbData) && dbData.length === 0) {
                // If DB is empty, initialize localStorage with empty array
                localStorage.setItem(entity, JSON.stringify([]));
                console.log(`Initialized ${entity} in localStorage with empty array`);
              }
            } else {
              console.warn(`Failed to load ${entity} from DB, initializing with empty array`);
              localStorage.setItem(entity, JSON.stringify([]));
            }
          } else {
            console.log(`${entity} already has data in localStorage, skipping initialization`);
          }
        } catch (error) {
          console.error(`Error initializing ${entity}:`, error);
          // Initialize with empty array in case of error
          try {
            localStorage.setItem(entity, JSON.stringify([]));
          } catch (storageError) {
            console.error(`Error initializing ${entity} in localStorage:`, storageError);
          }
        }
      }
    };
    
    initializeLocalStorageFromDB();
  }, []);

  return null;
}