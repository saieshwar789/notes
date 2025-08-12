import React, { useLayoutEffect, useRef, useState } from 'react';
import { Note } from '../types';
import StatusTag from './StatusTag';
import { CalendarIcon } from './icons';

interface HoverNoteCardProps {
  note: Note;
  position: { top: number; left: number; width: number; height: number };
}

const HoverNoteCard: React.FC<HoverNoteCardProps> = ({ note, position }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    opacity: 0,
    position: 'fixed',
  });

  useLayoutEffect(() => {
    if (cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = position.top + position.height + 8; // Position below by default
      let left = position.left + position.width / 2 - cardRect.width / 2;

      // Adjust if it overflows bottom
      if (top + cardRect.height > viewportHeight) {
        top = position.top - cardRect.height - 8; // Position above
      }

      // Adjust if it overflows right
      if (left + cardRect.width > viewportWidth - 16) {
        left = viewportWidth - cardRect.width - 16;
      }

      // Adjust if it overflows left
      if (left < 16) {
        left = 16;
      }
      
      setStyle({
        top: `${top}px`,
        left: `${left}px`,
        position: 'fixed',
        opacity: 1,
        transformOrigin: 'top center',
        zIndex: 100,
      });
    }
  }, [position]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  const isOverdue = note.deadline && new Date(note.deadline + 'T00:00:00').getTime() < new Date().setHours(0, 0, 0, 0);

  return (
    <div
      ref={cardRef}
      style={style}
      className="bg-[#2A2A2A]/20 backdrop-blur-xl border border-[#3f3f3f]/30 rounded-lg p-4 shadow-2xl w-80 flex flex-col gap-3 animate-fade-in"
    >
        <div>
            <h3 className="font-bold text-lg text-gray-100">{note.title}</h3>
            <p className="text-gray-400 text-sm mt-1">{note.content || 'No additional content'}</p>
        </div>
        
        <div className="border-t border-gray-700/50 pt-3 flex flex-col gap-2 text-xs text-gray-400">
            <div className="flex justify-between items-center">
                <span>Status</span>
                <StatusTag status={note.status} />
            </div>
             <div className="flex justify-between items-center">
                <span>Priority</span>
                <span className={`px-2 py-0.5 rounded-full text-white ${note.priority === 'High' ? 'bg-red-600' : 'bg-blue-600'}`}>{note.priority}</span>
            </div>
             <div className="flex justify-between items-center">
                <span>Effort</span>
                 <span className={`px-2 py-0.5 rounded-full text-white ${note.effort === 'High' ? 'bg-purple-600' : 'bg-green-600'}`}>{note.effort}</span>
            </div>
             {note.deadline && (
                 <div className="flex justify-between items-center">
                    <span>Deadline</span>
                    <span className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-400 font-semibold' : ''}`}>
                      <CalendarIcon className="w-3.5 h-3.5" />
                      {new Date(note.deadline + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                    </span>
                 </div>
             )}
        </div>
        
        <div className="border-t border-gray-700/50 pt-3 text-xs text-gray-500 flex justify-between">
            <span>Created:</span>
            <span>{formatDate(note.createdAt)}</span>
        </div>
         <div className="text-xs text-gray-500 flex justify-between">
            <span>Updated:</span>
            <span>{formatDate(note.updatedAt)}</span>
        </div>
    </div>
  );
};

export default HoverNoteCard;