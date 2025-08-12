import React, { useState, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Note, ViewMode, Habit } from './types';
import Header from './components/Header';
import NoteCard from './components/NoteCard';
import NoteListItem from './components/NoteListItem';
import { SearchIcon } from './components/icons';
import NoteEditorModal from './components/NoteEditorModal';
import KanbanBoard from './components/KanbanBoard';
import PriorityMatrix from './components/PriorityMatrix';
import HoverNoteCard from './components/HoverNoteCard';
import HabitTracker from './components/HabitTracker';

declare var confetti: any;

// --- Constants ---
const KANBAN_COLUMNS = ['Todo', 'In Progress', 'Completed'];

// A default set of notes for first-time users.
const initialNotes: Note[] = [
  { id: '1', title: 'Welcome to Notes!', content: 'This is a simple, sleek, and fast notes app built with React.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: 'Todo', priority: 'High', effort: 'Low', deadline: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0] },
  { id: '2', title: 'Plan new feature', content: 'You can create new notes, edit existing ones, delete them, and switch between grid and list views.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: 'In Progress', priority: 'High', effort: 'High', deadline: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0] },
  { id: '3', title: 'Review completed tasks', content: 'You can also manage your notes in a Kanban board. Drag and drop notes between columns!', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: 'Completed', priority: 'Low', effort: 'Low', deadline: null },
  { id: '4', title: 'Organize documentation', content: 'This task can be delegated.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: 'Todo', priority: 'Low', effort: 'High', deadline: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0] },
];

const initialHabits: Habit[] = [];

type HoveredNoteInfo = {
  note: Note;
  position: { top: number; left: number; width: number; height: number };
} | null;

function App() {
  const [notes, setNotes] = useLocalStorage<Note[]>('notes-v3', initialNotes);
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits-v1', initialHabits);
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>('notes-view-mode', ViewMode.Grid);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [hoveredNoteInfo, setHoveredNoteInfo] = useState<HoveredNoteInfo>(null);
  const [isDragging, setIsDragging] = useState(false);

  // --- Drag & Drop State Handlers ---
  const handleDragStartApp = useCallback(() => {
    setHoveredNoteInfo(null);
    setIsDragging(true);
  }, []);

  const handleDragEndApp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // --- Hover Handlers ---
  const handleNoteHover = useCallback((note: Note, targetRect: DOMRect) => {
    if (isDragging) return; // Do not show tooltip while dragging
    setHoveredNoteInfo({
        note,
        position: {
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
        },
    });
  }, [isDragging]);

  const handleNoteUnhover = useCallback(() => {
    setHoveredNoteInfo(null);
  }, []);

  // --- Note State Modification Handlers ---

  const handleNewNote = useCallback(() => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Todo',
      priority: 'Low',
      effort: 'Low',
      deadline: null,
    };
    
    setNotes(prevNotes => [newNote, ...prevNotes]);
    setEditingNoteId(newNote.id);
  }, [setNotes]);

  const handleUpdateNote = useCallback((updatedNote: Note) => {
    setNotes(prevNotes =>
      prevNotes.map(note => (note.id === updatedNote.id ? updatedNote : note))
    );
    setEditingNoteId(null);
  }, [setNotes]);

  const handleDeleteNote = useCallback((idToDelete: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== idToDelete));
    if (editingNoteId === idToDelete) {
      setEditingNoteId(null);
    }
  }, [editingNoteId, setNotes]);
  
  const handleNoteStatusChange = useCallback((noteId: string, newStatus: string) => {
    setNotes(prevNotes => {
      const noteToMove = prevNotes.find(note => note.id === noteId);
      
      if (noteToMove && noteToMove.status !== newStatus && newStatus === 'Completed') {
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
            zIndex: 9999,
          });
        }
      }
      
      return prevNotes.map(note =>
        note.id === noteId
          ? { ...note, status: newStatus, updatedAt: new Date().toISOString() }
          : note
      );
    });
  }, [setNotes]);
  
  const handleNotePriorityChange = useCallback((noteId: string, newPriority: 'High' | 'Low', newEffort: 'High' | 'Low') => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === noteId
          ? { ...note, priority: newPriority, effort: newEffort, updatedAt: new Date().toISOString() }
          : note
      )
    );
  }, [setNotes]);
  
  // --- Habit State Modification Handlers ---
  const handleAddHabit = useCallback((name: string) => {
      if (!name.trim()) return;
      const newHabit: Habit = {
          id: `h-${Date.now()}`,
          name: name.trim(),
          completions: {},
      };
      setHabits(prev => [...prev, newHabit]);
  }, [setHabits]);

  const handleUpdateHabit = useCallback((id: string, newName: string) => {
      if (!newName.trim()) return;
      setHabits(prev => prev.map(h => h.id === id ? { ...h, name: newName.trim() } : h));
  }, [setHabits]);

  const handleDeleteHabit = useCallback((id: string) => {
      setHabits(prev => prev.filter(h => h.id !== id));
  }, [setHabits]);

  const handleToggleHabitCompletion = useCallback((habitId: string, date: string) => {
      setHabits(prev => prev.map(h => {
          if (h.id === habitId) {
              const newCompletions = { ...h.completions };
              if (newCompletions[date]) {
                  delete newCompletions[date];
              } else {
                  newCompletions[date] = true;
              }
              return { ...h, completions: newCompletions };
          }
          return h;
      }));
  }, [setHabits]);


  const handleExportToCsv = useCallback(() => {
    if (notes.length === 0) {
      alert("No notes to export.");
      return;
    }

    const escapeCsvField = (field: any): string => {
      const stringField = String(field ?? '').trim();
      if (/[",\n]/.test(stringField)) {
        return `"${stringField.replace(/"/g, '""')}"`;
      }
      return stringField;
    };
    
    const headers: (keyof Note)[] = ['id', 'title', 'content', 'status', 'priority', 'effort', 'deadline', 'createdAt', 'updatedAt'];
    const csvRows = [headers.join(',')];

    notes.forEach(note => {
      const row = headers.map(header => escapeCsvField(note[header]));
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `notes-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [notes]);

  // --- Editor Modal Handlers ---
  
  const handleStartEditing = useCallback((noteId: string) => {
    setEditingNoteId(noteId);
  }, []);

  const handleStopEditing = useCallback(() => {
    setEditingNoteId(null);
  }, []);

  // --- Derived State ---

  const noteToEdit = useMemo(
    () => notes.find(note => note.id === editingNoteId) || null,
    [notes, editingNoteId]
  );
  
  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [notes]);

  const filteredNotes = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      return sortedNotes;
    }
    return sortedNotes.filter(note =>
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  }, [sortedNotes, searchQuery]);

  const renderContent = () => {
    if (viewMode === ViewMode.HabitTracker) {
        return (
            <HabitTracker 
                habits={habits}
                onAddHabit={handleAddHabit}
                onUpdateHabit={handleUpdateHabit}
                onDeleteHabit={handleDeleteHabit}
                onToggleCompletion={handleToggleHabitCompletion}
            />
        );
    }
      
    if (viewMode === ViewMode.Matrix) {
        return (
          <PriorityMatrix
            notes={sortedNotes}
            onEditNote={handleStartEditing}
            onDeleteNote={handleDeleteNote}
            onNoteStatusChange={handleNoteStatusChange}
            onNotePriorityChange={handleNotePriorityChange}
            onNoteHover={handleNoteHover}
            onNoteUnhover={handleNoteUnhover}
            onDragStartApp={handleDragStartApp}
            onDragEndApp={handleDragEndApp}
          />
        );
    }
      
    if (viewMode === ViewMode.Board) {
      return (
        <KanbanBoard
          notes={sortedNotes}
          columns={KANBAN_COLUMNS}
          onEditNote={handleStartEditing}
          onDeleteNote={handleDeleteNote}
          onNoteStatusChange={handleNoteStatusChange}
          onNoteHover={handleNoteHover}
          onNoteUnhover={handleNoteUnhover}
          onDragStartApp={handleDragStartApp}
          onDragEndApp={handleDragEndApp}
        />
      );
    }

    if (filteredNotes.length > 0) {
      if (viewMode === ViewMode.Grid) {
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredNotes.map(note => (
              <NoteCard 
                key={note.id} 
                note={note}
                onEdit={handleStartEditing}
                onDelete={handleDeleteNote}
                onStatusChange={handleNoteStatusChange}
                onNoteHover={handleNoteHover}
                onNoteUnhover={handleNoteUnhover}
                onDragStartApp={handleDragStartApp}
                onDragEndApp={handleDragEndApp}
              />
            ))}
          </div>
        );
      }
      if (viewMode === ViewMode.List) {
        return (
          <div className="flex flex-col gap-3">
            {filteredNotes.map(note => (
              <NoteListItem 
                key={note.id} 
                note={note} 
                onEdit={handleStartEditing}
                onDelete={handleDeleteNote}
                onStatusChange={handleNoteStatusChange}
                onNoteHover={handleNoteHover}
                onNoteUnhover={handleNoteUnhover}
              />
            ))}
          </div>
        );
      }
    }

    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-400">No notes found</h2>
        <p className="text-gray-500 mt-2">
          {searchQuery ? `Try adjusting your search query, or ` : `Why not `} 
          <button onClick={handleNewNote} className="text-blue-500 hover:underline">create a new one</button>?
        </p>
      </div>
    );
  };

  return (
    <div className="bg-[#121212] text-white min-h-screen font-sans">
      <main className="max-w-7xl mx-auto p-6 sm:p-8 flex flex-col h-screen">
        <Header
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onNewNote={handleNewNote}
          onExport={handleExportToCsv}
        />

        {viewMode !== ViewMode.Board && viewMode !== ViewMode.Matrix && viewMode !== ViewMode.HabitTracker && (
          <div className="relative mb-8">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search your notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-lg py-3 pl-12 pr-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        )}
        
        <div className="flex-grow overflow-auto relative">
          {renderContent()}
        </div>
        
      </main>

      {noteToEdit && (
        <NoteEditorModal
          note={noteToEdit}
          onSave={handleUpdateNote}
          onClose={handleStopEditing}
          onDelete={handleDeleteNote}
        />
      )}

      {hoveredNoteInfo && createPortal(
          <HoverNoteCard 
            note={hoveredNoteInfo.note} 
            position={hoveredNoteInfo.position} 
          />,
          document.getElementById('portal-root')!
      )}
    </div>
  );
}

export default App;