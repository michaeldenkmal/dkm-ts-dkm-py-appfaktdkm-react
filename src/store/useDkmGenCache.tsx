import { useSyncExternalStore } from "react";

const cache = new Map<string, any>();


const subs = new Set<() => void>();

function subscribe(cb: () => void) { subs.add(cb); return () => subs.delete(cb); }
function notify() { subs.forEach(fn => fn()); }

export interface UseDkmGenCacheRes {

}

export function useDkmGenCache<T>(key: string): T | undefined {
  useSyncExternalStore(subscribe, () => cache.get(key));
  return cache.get(key);
}

export function setDkmGenCache<T>(key: string, value: T) {
  cache.set(key, value);
  notify();
}

