import { create } from 'zustand';
import { Plant, JournalEntry, TaskItem } from './types';

interface FloraState {
  plants: Plant[];
  journalEntries: JournalEntry[];
  tasks: TaskItem[];
  activeTab: 'plants' | 'schedule' | 'journal' | 'stats';
  setActiveTab: (tab: 'plants' | 'schedule' | 'journal' | 'stats') => void;
  addPlant: (plant: Omit<Plant, 'id'>) => void;
  updatePlant: (id: string, plant: Partial<Plant>) => void;
  deletePlant: (id: string) => void;
  waterPlant: (id: string) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  toggleTask: (id: string) => void;
}

const initialPlants: Plant[] = [
  {
    id: '1',
    name: 'Monstera Deliciosa',
    species: 'Monstera deliciosa',
    room: 'Living Room',
    wateringIntervalDays: 7,
    lastWatered: new Date(Date.now() - 5 * 86400000).toISOString(),
    light: 'Bright Indirect',
    notes: 'New leaf unfurling! Wipe leaves monthly.',
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600',
    health: 'Thriving',
  },
  {
    id: '2',
    name: 'Fiddle Leaf Fig',
    species: 'Ficus lyrata',
    room: 'Sunroom',
    wateringIntervalDays: 10,
    lastWatered: new Date(Date.now() - 9 * 86400000).toISOString(),
    light: 'Direct',
    notes: 'Sensitive to drafts. Rotate weekly.',
    imageUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=600',
    health: 'Needs Attention',
  },
  {
    id: '3',
    name: 'Snake Plant',
    species: 'Sansevieria trifasciata',
    room: 'Bedroom',
    wateringIntervalDays: 21,
    lastWatered: new Date(Date.now() - 14 * 86400000).toISOString(),
    light: 'Low',
    notes: 'Hardy and drought tolerant. Do not overwater.',
    imageUrl: 'https://images.unsplash.com/photo-1599598425947-440d575a5ed4?auto=format&fit=crop&q=80&w=600',
    health: 'Thriving',
  },
  {
    id: '4',
    name: 'Golden Pothos',
    species: 'Epipremnum aureum',
    room: 'Kitchen',
    wateringIntervalDays: 7,
    lastWatered: new Date(Date.now() - 2 * 86400000).toISOString(),
    light: 'Medium',
    notes: 'Trailing nicely across the shelf.',
    imageUrl: 'https://images.unsplash.com/photo-1572688484438-313038612f7d?auto=format&fit=crop&q=80&w=600',
    health: 'Thriving',
  }
];

const initialJournal: JournalEntry[] = [
  {
    id: 'j1',
    plantId: '1',
    date: new Date(Date.now() - 5 * 86400000).toISOString(),
    note: 'Watered thoroughly and checked for pests. All clean!',
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'j2',
    plantId: '2',
    date: new Date(Date.now() - 9 * 86400000).toISOString(),
    note: 'Rotated pot towards sunlight to encourage even growth.',
  }
];

const initialTasks: TaskItem[] = [
  {
    id: 't1',
    plantId: '2',
    plantName: 'Fiddle Leaf Fig',
    taskType: 'Water',
    dueDate: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0],
    completed: false,
  },
  {
    id: 't2',
    plantId: '1',
    plantName: 'Monstera Deliciosa',
    taskType: 'Fertilize',
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    completed: false,
  }
];

export const useFloraStore = create<FloraState>((set) => ({
  plants: initialPlants,
  journalEntries: initialJournal,
  tasks: initialTasks,
  activeTab: 'plants',
  setActiveTab: (tab) => set({ activeTab: tab }),
  addPlant: (plantData) => set((state) => {
    const newPlant: Plant = { ...plantData, id: Date.now().toString() };
    return { plants: [newPlant, ...state.plants] };
  }),
  updatePlant: (id, updated) => set((state) => ({
    plants: state.plants.map(p => p.id === id ? { ...p, ...updated } : p)
  })),
  deletePlant: (id) => set((state) => ({
    plants: state.plants.filter(p => p.id !== id),
    journalEntries: state.journalEntries.filter(j => j.plantId !== id),
    tasks: state.tasks.filter(t => t.plantId !== id)
  })),
  waterPlant: (id) => set((state) => {
    const now = new Date().toISOString();
    return {
      plants: state.plants.map(p => p.id === id ? { ...p, lastWatered: now } : p),
      journalEntries: [
        { id: Date.now().toString(), plantId: id, date: now, note: 'Watered plant.' },
        ...state.journalEntries
      ]
    };
  }),
  addJournalEntry: (entryData) => set((state) => ({
    journalEntries: [{ ...entryData, id: Date.now().toString() }, ...state.journalEntries]
  })),
  toggleTask: (id) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
  }))
}));
