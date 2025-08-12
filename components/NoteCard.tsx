import React from 'react';
import { Note } from '../types';
import { TrashIcon, CalendarIcon } from './icons';
import StatusTag from './StatusTag';

interface NoteCardProps {
  note: Note;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: string) => void;
  onNoteHover: (note: Note, targetRect: DOMRect) => void;
  onNoteUnhover: () => void;
  onDragStartApp: () => void;
  onDragEndApp: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete, onStatusChange, onNoteHover, onNoteUnhover, onDragStartApp, onDragEndApp }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const formatDeadline = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const isOverdue = note.deadline && new Date(note.deadline + 'T00:00:00').getTime() < new Date().setHours(0, 0, 0, 0);


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
      className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-lg p-5 flex flex-col h-40 transition-transform hover:scale-105 cursor-pointer group relative"
      onClick={() => onEdit(note.id)}
      role="button"
      aria-label={`Edit note titled ${note.title}`}
    >
      <button
        onClick={handleDeleteClick}
        className="absolute top-2 right-2 p-1.5 rounded-full text-gray-500 bg-transparent hover:bg-red-900/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all z-10"
        aria-label="Delete note"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
      <div className="flex-grow overflow-hidden">
        <h3 className="font-bold text-lg text-gray-100 truncate">{note.title}</h3>
        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{note.content || 'No additional content'}</p>

      </div>
      <div className="flex justify-between items-center text-xs text-gray-500 mt-4 flex-shrink-0">
        <StatusTag status={note.status} onClick={handleStatusClick} />
        <div className="flex items-center gap-2">
            {note.deadline && (
              <span title={`Due: ${new Date(note.deadline + 'T00:00:00').toLocaleDateString()}`} className={`flex items-center gap-1 ${isOverdue ? 'text-red-400 font-semibold' : ''}`}>
                <CalendarIcon className="w-3.5 h-3.5" />
                {formatDeadline(note.deadline)}
              </span>
            )}
            <span className="text-right">{formatDate(note.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;