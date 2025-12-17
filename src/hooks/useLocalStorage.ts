import { useState, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}

// Hook to manage game data in localStorage
export function useGameStorage() {
  const saveGame = useCallback((code: string, game: unknown) => {
    try {
      window.localStorage.setItem(`game:${code}`, JSON.stringify(game));
    } catch (error) {
      console.error('Error saving game:', error);
    }
  }, []);

  const loadGame = useCallback((code: string) => {
    try {
      const item = window.localStorage.getItem(`game:${code}`);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error loading game:', error);
      return null;
    }
  }, []);

  const deleteGame = useCallback((code: string) => {
    try {
      window.localStorage.removeItem(`game:${code}`);
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  }, []);

  const getAllGames = useCallback(() => {
    const games: string[] = [];
    try {
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key?.startsWith('game:')) {
          games.push(key.replace('game:', ''));
        }
      }
    } catch (error) {
      console.error('Error getting games:', error);
    }
    return games;
  }, []);

  return { saveGame, loadGame, deleteGame, getAllGames };
}
