import React from 'react';
import { Note } from '../types';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  notes: Note[];
  columns: string[];
  onEditNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onNoteStatusChange: (noteId: string, newStatus: string) => void;
  onNoteHover: (note: Note, targetRect: DOMRect) => void;
  onNoteUnhover: () => void;
  onDragStartApp: () => void;
  onDragEndApp: () => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ notes, columns, onEditNote, onDeleteNote, onNoteStatusChange, onNoteHover, onNoteUnhover, onDragStartApp, onDragEndApp }) => {
  return (
    <div className="flex gap-6 h-full">
      {columns.map(status => {
        const notesForColumn = notes
          .filter(note => note.status === status)
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

        return (
          <KanbanColumn
            key={status}
            status={status}
            notes={notesForColumn}
            onEditNote={onEditNote}
            onDeleteNote={onDeleteNote}
            onNoteDrop={onNoteStatusChange}
            onNoteStatusChange={onNoteStatusChange}
            onNoteHover={onNoteHover}
            onNoteUnhover={onNoteUnhover}
            onDragStartApp={onDragStartApp}
            onDragEndApp={onDragEndApp}
          />
        );
      })}
    </div>
  );
};

export default KanbanBoard;