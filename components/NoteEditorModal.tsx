import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { TrashIcon } from './icons';

interface NoteEditorModalProps {
  note: Note;
  onSave: (note: Note) => void;
  onClose: () => void;
  onDelete: (noteId: string) => void;
}

const NoteEditorModal: React.FC<NoteEditorModalProps> = ({ note, onSave, onClose, onDelete }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'High' | 'Low'>(note.priority || 'Low');
  const [effort, setEffort] = useState<'High' | 'Low'>(note.effort || 'Low');
  const [deadline, setDeadline] = useState(note.deadline || '');

  useEffect(() => {
    if (note.title === 'Untitled' && !note.content) {
      setText('');
    } else {
      setText([note.title, note.content].filter(Boolean).join('\n'));
    }
    setPriority(note.priority || 'Low');
    setEffort(note.effort || 'Low');
    setDeadline(note.deadline || '');
  }, [note]);

  const handleSave = () => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      onDelete(note.id); // If note is empty, delete it
      return;
    }

    const lines = trimmedText.split('\n');
    const newTitle = lines[0] || 'Untitled';
    const newContent = lines.slice(1).join('\n');

    onSave({
      ...note,
      title: newTitle,
      content: newContent,
      updatedAt: new Date().toISOString(),
      priority,
      effort,
      deadline: deadline || null,
    });
  };
  
  const handleDelete = () => {
    onDelete(note.id);
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="editor-title"
    >
      <div 
        className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl shadow-lg w-full max-w-2xl mx-4 p-6 flex flex-col gap-4 h-full max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center flex-shrink-0">
          <h2 id="editor-title" className="text-xl font-bold text-gray-100">Edit Note</h2>
          <button
            onClick={handleDelete}
            className="p-2 rounded-full text-gray-400 hover:bg-red-900/50 hover:text-red-400 transition-colors"
            aria-label="Delete note"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Title&#10;Start writing your note here..."
          className="w-full bg-[#252525] border border-[#333] rounded-lg p-4 text-gray-200 placeholder-gray-500 flex-grow resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
          aria-label="Note content"
          autoFocus
        ></textarea>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 flex-shrink-0 text-sm">
          <div>
              <label className="font-semibold text-gray-400 mb-2 block">Priority</label>
              <div className="flex gap-2">
                <button onClick={() => setPriority('High')} className={`px-3 py-1.5 rounded-md transition-colors ${priority === 'High' ? 'bg-red-600 text-white' : 'bg-[#252525] hover:bg-[#333]'}`}>High</button>
                <button onClick={() => setPriority('Low')} className={`px-3 py-1.5 rounded-md transition-colors ${priority === 'Low' ? 'bg-blue-600 text-white' : 'bg-[#252525] hover:bg-[#333]'}`}>Low</button>
              </div>
          </div>
          <div>
              <label className="font-semibold text-gray-400 mb-2 block">Effort / Time Needed</label>
              <div className="flex gap-2">
                <button onClick={() => setEffort('High')} className={`px-3 py-1.5 rounded-md transition-colors ${effort === 'High' ? 'bg-purple-600 text-white' : 'bg-[#252525] hover:bg-[#333]'}`}>High</button>
                <button onClick={() => setEffort('Low')} className={`px-3 py-1.5 rounded-md transition-colors ${effort === 'Low' ? 'bg-green-600 text-white' : 'bg-[#252525] hover:bg-[#333]'}`}>Low</button>
              </div>
          </div>
           <div>
              <label className="font-semibold text-gray-400 mb-2 block">Deadline</label>
              <div className="flex items-center gap-2">
                  <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="bg-[#252525] border border-[#333] rounded-md px-3 py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none"
                  />
                  {deadline && (
                      <button onClick={() => setDeadline('')} className="text-gray-400 hover:text-white text-xs">Clear</button>
                  )}
              </div>
           </div>
        </div>

        <div className="flex justify-end gap-4 mt-2 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#333] text-gray-200 font-semibold hover:bg-[#444] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteEditorModal;