import { atom } from 'jotai';

export const counterAtom = atom(0);
export const todosAtom = atom<string[]>([]);

export const todoStatsAtom = atom((get) => ({
  total: get(todosAtom).length
})); 