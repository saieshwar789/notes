import React, { useCallback, useState } from 'react';
import { Note } from '../types';
import MatrixNoteItem from './MatrixNoteItem';

interface MatrixQuadrantProps {
  notes: Note[];
  priority: 'High' | 'Low';
  effort: 'High' | 'Low';
  onNoteDrop: (noteId: string, newPriority: 'High' | 'Low', newEffort: 'High' | 'Low') => void;
  onEditNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onNoteStatusChange: (noteId: string, newStatus: string) => void;
  onNoteHover: (note: Note, targetRect: DOMRect) => void;
  onNoteUnhover: () => void;
  onDragStartApp: () => void;
  onDragEndApp: () => void;
}

const MatrixQuadrant: React.FC<MatrixQuadrantProps> = ({ notes, priority, effort, onNoteDrop, onEditNote, onDeleteNote, onNoteStatusChange, onNoteHover, onNoteUnhover, onDragStartApp, onDragEndApp }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const noteId = e.dataTransfer.getData('noteId');
    if (noteId) {
      onNoteDrop(noteId, priority, effort);
      // Manually reset the app's dragging state. This fixes a bug where
      // the hover tooltip would be permanently disabled after a drop, because
      // the original dragged item's onDragEnd event might not fire.
      onDragEndApp();
    }
  }, [onNoteDrop, priority, effort, onDragEndApp]);

  return (
    <div 
      className={`bg-[#161616] rounded-xl p-4 flex flex-wrap gap-2 items-start content-start min-h-[150px] h-full transition-colors ${isOver ? 'bg-[#2a2a2a]' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {notes.length > 0 ? (
        notes.map(note => (
          <MatrixNoteItem
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
        isOver && (
          <div className="flex justify-center items-center w-full min-h-[100px] text-sm text-gray-500 rounded-lg border-2 border-dashed border-gray-700 pointer-events-none">
            Drop note here
          </div>
        )
      )}
    </div>
  );
};

export default MatrixQuadrant;