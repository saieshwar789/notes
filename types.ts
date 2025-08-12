export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO string format
  updatedAt: string; // ISO string format
  status: string; // For Kanban board
  priority: 'High' | 'Low'; // For Priority Matrix
  effort: 'High' | 'Low';   // For Priority Matrix
  deadline: string | null; // YYYY-MM-DD format
}

export interface Habit {
  id: string;
  name: string;
  completions: { [date: string]: boolean }; // date format: 'YYYY-MM-DD'
}

export enum ViewMode {
  Grid = 'GRID',
  List = 'LIST',
  Board = 'BOARD',
  Matrix = 'MATRIX',
  HabitTracker = 'HABIT_TRACKER',
}
