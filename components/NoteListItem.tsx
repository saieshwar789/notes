import React from 'react';
import { Note } from '../types';
import { TrashIcon, CalendarIcon } from './icons';
import StatusTag from './StatusTag';

interface NoteListItemProps {
  note: Note;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: string) => void;
  onNoteHover: (note: Note, targetRect: DOMRect) => void;
  onNoteUnhover: () => void;
}

const NoteListItem: React.FC<NoteListItemProps> = ({ note, onEdit, onDelete, onStatusChange, onNoteHover, onNoteUnhover }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatDeadline = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const isOverdue = note.deadline && new Date(note.deadline + 'T00:00:00').getTime() < new Date().setHours(0, 0, 0, 0);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(note.id);
  };

  const statusCycle: { [key: string]: string } = {
    'Todo': 'In Progress',
    'In Progress': 'Completed',
    'Completed': 'Todo',
  };

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent list item's onEdit from firing
    const newStatus = statusCycle[note.status] || 'Todo';
    onStatusChange(note.id, newStatus);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onNoteHover(note, rect);
  };

  return (
    <div
      className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-lg p-4 flex items-center justify-between transition-colors hover:bg-[#252525] cursor-pointer group"
      onClick={() => onEdit(note.id)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onNoteUnhover}
      role="button"
      aria-label={`Edit note titled ${note.title}`}
    >
      <div className="flex-1 min-w-0 pr-4">
        <p className="font-semibold text-gray-100 truncate">{note.title}</p>
        <p className="text-gray-400 text-sm mt-1 truncate">{note.content || 'No additional content'}</p>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-500 ml-4 flex-shrink-0">
        {note.deadline && (
            <span title={`Due: ${new Date(note.deadline + 'T00:00:00').toLocaleDateString()}`} className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-400' : ''}`}>
                <CalendarIcon className="w-4 h-4" />
                {formatDeadline(note.deadline)}
            </span>
        )}
        <StatusTag status={note.status} onClick={handleStatusClick} />
        <span className="w-32 text-right">{formatDate(note.updatedAt)}</span>
        <button
          onClick={handleDeleteClick}
          className="p-2 rounded-full text-gray-500 hover:bg-red-900/50 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Delete note"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default NoteListItem;