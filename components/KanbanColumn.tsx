import React from 'react';
import { Note } from '../types';
import KanbanNoteItem from './KanbanNoteItem';

interface KanbanColumnProps {
  status: string;
  notes: Note[];
  onEditNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onNoteDrop: (noteId: string, newStatus: string) => void;
  onNoteStatusChange: (noteId: string, newStatus: string) => void;
  onNoteHover: (note: Note, targetRect: DOMRect) => void;
  onNoteUnhover: () => void;
  onDragStartApp: () => void;
  onDragEndApp: () => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, notes, onEditNote, onDeleteNote, onNoteDrop, onNoteStatusChange, onNoteHover, onNoteUnhover, onDragStartApp, onDragEndApp }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const noteId = e.dataTransfer.getData('noteId');
    const noteIsAlreadyInColumn = notes.some(n => n.id === noteId);

    if (noteId && !noteIsAlreadyInColumn) {
      onNoteDrop(noteId, status);
      // Manually reset the app's dragging state. This is crucial because
      // the original dragged item will be unmounted upon state change,
      // and its own onDragEnd event may not fire reliably.
      onDragEndApp();
    }
  };

  return (
    <div 
      className="bg-[#161616] rounded-xl flex-1 flex flex-col max-h-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="p-4 border-b border-[#2A2A2A] flex-shrink-0">
        <h2 className="font-bold text-lg text-gray-300">{status} <span className="text-gray-500 text-base font-normal">{notes.length}</span></h2>
      </div>
      <div className="p-4 flex flex-col gap-4 overflow-y-auto">
        {notes.length > 0 ? (
          notes.map(note => (
            <KanbanNoteItem
              key={note.id}
              note={note}
              onEdit={onEditNote}
              onDelete={onDeleteNote}
              onStatusChange={onNoteStatusChange}
              onNoteHover={onNoteHover}
              onNoteUnhover={onNoteUnhover}
              onDragStartApp={onDragStartApp}
              onDragEndApp={onDragEndApp}
            />
          ))
        ) : (
          <div className="flex justify-center items-center h-20 text-sm text-gray-500 rounded-lg border-2 border-dashed border-gray-700">
            Drop notes here
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;