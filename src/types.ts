export interface Plant {
  id: string;
  name: string;
  species: string;
  room: string;
  wateringIntervalDays: number;
  lastWatered: string; // ISO date
  light: 'Direct' | 'Bright Indirect' | 'Medium' | 'Low';
  notes: string;
  imageUrl: string;
  health: 'Thriving' | 'Needs Attention' | 'Recovering';
}

export interface JournalEntry {
  id: string;
  plantId: string;
  date: string;
  note: string;
  imageUrl?: string;
}

export interface TaskItem {
  id: string;
  plantId: string;
  plantName: string;
  taskType: 'Water' | 'Fertilize' | 'Repot' | 'Mist';
  dueDate: string;
  completed: boolean;
}
