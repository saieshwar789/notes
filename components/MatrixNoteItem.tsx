import React from 'react';
import { Note } from '../types';
import { TrashIcon, CalendarIcon } from './icons';
import StatusTag from './StatusTag';

interface MatrixNoteItemProps {
  note: Note;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: string) => void;
  onNoteHover: (note: Note, targetRect: DOMRect) => void;
  onNoteUnhover: () => void;
  onDragStartApp: () => void;
  onDragEndApp: () => void;
}

const MatrixNoteItem: React.FC<MatrixNoteItemProps> = ({ note, onEdit, onDelete, onStatusChange, onNoteHover, onNoteUnhover, onDragStartApp, onDragEndApp }) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(note.id);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('noteId', note.id);
    onDragStartApp();
  };

  const statusCycle: { [key: string]: string } = {
    'Todo': 'In Progress',
    'In Progress': 'Completed',
    'Completed': 'Todo',
  };

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card's onEdit from firing
    const newStatus = statusCycle[note.status] || 'Todo';
    onStatusChange(note.id, newStatus);
  };
  
  const isOverdue = note.deadline && new Date(note.deadline + 'T00:00:00').getTime() < new Date().setHours(0, 0, 0, 0);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onNoteHover(note, rect);
  };

  return (
    <div
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={onDragEndApp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onNoteUnhover}
      className="bg-[#2A2A2A] border border-transparent hover:border-blue-500 rounded-lg pl-3 pr-8 py-2 inline-flex items-center gap-2 transition-all cursor-pointer group relative max-w-full"
      onClick={() => onEdit(note.id)}
      role="button"
      aria-label={`Edit note titled ${note.title}`}
    >
      <span className="text-sm font-medium text-gray-200 truncate min-w-0">{note.title}</span>
      <div className="flex items-center gap-2">
        {note.deadline && (
            <span title={`Due: ${new Date(note.deadline + 'T00:00:00').toLocaleDateString()}`}>
                <CalendarIcon className={`w-3.5 h-3.5 ${isOverdue ? 'text-red-400' : 'text-gray-400'}`} />
            </span>
        )}
        <StatusTag status={note.status} onClick={handleStatusClick} size="small" />
      </div>
      <button
        onClick={handleDeleteClick}
        className="absolute top-1/2 right-2 -translate-y-1/2 p-1 rounded-full text-gray-500 bg-transparent hover:bg-red-900/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all z-10"
        aria-label="Delete note"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default MatrixNoteItem;