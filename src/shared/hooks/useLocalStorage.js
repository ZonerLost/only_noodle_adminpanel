import { useEffect, useState } from "react";
export default function useLocalStorage(key, initial) {
  const read = () => {
    try {
      const v = localStorage.getItem(key);
      return v === null ? initial : JSON.parse(v);
    } catch {
      return initial;
    }
  };
  const [state, setState] = useState(read);
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Silently ignore localStorage errors
    }
  }, [key, state]);
  return [state, setState];
}
