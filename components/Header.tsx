import React from 'react';
import { ViewMode } from '../types';
import { DocumentIcon, GridIcon, ListIcon, PlusIcon, KanbanIcon, MatrixIcon, ExportIcon, HabitTrackerIcon } from './icons';

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onNewNote: () => void;
  onExport: () => void;
}

const Header: React.FC<HeaderProps> = ({ viewMode, onViewModeChange, onNewNote, onExport }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <DocumentIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-100">Notes</h1>
        </div>
        <div className="hidden sm:flex items-center gap-3">
            <div className="h-6 w-px bg-gray-700"></div>
            <span className="text-sm text-gray-400 font-medium">{currentDate}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center bg-[#252525] p-1 rounded-lg">
          <button
            onClick={() => onViewModeChange(ViewMode.Grid)}
            className={`p-1.5 rounded-md transition-colors ${viewMode === ViewMode.Grid ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
            aria-label="Grid view"
          >
            <GridIcon className="w-5 h-5 text-gray-300" />
          </button>
          <button
            onClick={() => onViewModeChange(ViewMode.List)}
            className={`p-1.5 rounded-md transition-colors ${viewMode === ViewMode.List ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
            aria-label="List view"
          >
            <ListIcon className="w-5 h-5 text-gray-300" />
          </button>
          <button
            onClick={() => onViewModeChange(ViewMode.Board)}
            className={`p-1.5 rounded-md transition-colors ${viewMode === ViewMode.Board ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
            aria-label="Board view"
          >
            <KanbanIcon className="w-5 h-5 text-gray-300" />
          </button>
          <button
            onClick={() => onViewModeChange(ViewMode.Matrix)}
            className={`p-1.5 rounded-md transition-colors ${viewMode === ViewMode.Matrix ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
            aria-label="Matrix view"
          >
            <MatrixIcon className="w-5 h-5 text-gray-300" />
          </button>
          <button
            onClick={() => onViewModeChange(ViewMode.HabitTracker)}
            className={`p-1.5 rounded-md transition-colors ${viewMode === ViewMode.HabitTracker ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
            aria-label="Habit Tracker view"
          >
            <HabitTrackerIcon className="w-5 h-5 text-gray-300" />
          </button>
          <div className="h-4 w-px bg-gray-600 mx-1"></div>
          <button
            onClick={onExport}
            className={`p-1.5 rounded-md transition-colors hover:bg-gray-800`}
            aria-label="Export to CSV"
            title="Export to CSV"
          >
            <ExportIcon className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        <button
          onClick={onNewNote}
          className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          New Note
        </button>
      </div>
    </header>
  );
};

export default Header;
