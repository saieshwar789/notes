import React, { useCallback } from 'react';
import { Note } from '../types';
import MatrixQuadrant from './MatrixQuadrant';

interface PriorityMatrixProps {
  notes: Note[];
  onEditNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onNoteStatusChange: (noteId: string, newStatus: string) => void;
  onNotePriorityChange: (noteId: string, newPriority: 'High' | 'Low', newEffort: 'High' | 'Low') => void;
  onNoteHover: (note: Note, targetRect: DOMRect) => void;
  onNoteUnhover: () => void;
  onDragStartApp: () => void;
  onDragEndApp: () => void;
}

interface Quadrant {
  priority: 'High' | 'Low';
  effort: 'High' | 'Low';
}

const PriorityMatrix: React.FC<PriorityMatrixProps> = ({ notes, onEditNote, onDeleteNote, onNoteStatusChange, onNotePriorityChange, onNoteHover, onNoteUnhover, onDragStartApp, onDragEndApp }) => {
  const quadrants: Quadrant[] = [
    { priority: 'High', effort: 'Low' },
    { priority: 'High', effort: 'High' },
    { priority: 'Low', effort: 'Low' },
    { priority: 'Low', effort: 'High' },
  ];

  const getQuadrantNotes = (priority: 'High' | 'Low', effort: 'High' | 'Low') => {
    return notes.filter(note => note.priority === priority && note.effort === effort);
  };

  const handleNoteDrop = useCallback((noteId: string, newPriority: 'High' | 'Low', newEffort: 'High' | 'Low') => {
    // Simplified handler: Always delegate the update to the parent App component.
    // This removes the conditional check that was using a potentially stale `notes` array
    // and was the root cause of the bug.
    onNotePriorityChange(noteId, newPriority, newEffort);
  }, [onNotePriorityChange]);

  return (
    <div className="flex flex-col text-gray-400 relative pl-12 pt-8">
      {/* Y-Axis Label */}
      <div className="absolute top-1/2 -left-4 -translate-y-1/2 flex items-center justify-center" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg) translateY(50%) translateX(-50%)', left: '0' }}>
        <span className="font-bold text-lg tracking-wider">PRIORITY</span>
      </div>
       {/* X-Axis Label */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center">
        <span className="font-bold text-lg tracking-wider">EFFORT / TIME</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {quadrants.map(({ priority, effort }) => (
          <MatrixQuadrant
            key={`${priority}-${effort}`}
            priority={priority}
            effort={effort}
            notes={getQuadrantNotes(priority, effort)}
            onNoteDrop={handleNoteDrop}
            onEditNote={onEditNote}
            onDeleteNote={onDeleteNote}
            onNoteStatusChange={onNoteStatusChange}
            onNoteHover={onNoteHover}
            onNoteUnhover={onNoteUnhover}
            onDragStartApp={onDragStartApp}
            onDragEndApp={onDragEndApp}
          />
        ))}
      </div>
    </div>
  );
};

export default PriorityMatrix;