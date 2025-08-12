import React, { useState } from 'react';
import { Habit } from '../types';
import { TrashIcon } from './icons';

interface HabitTrackerProps {
    habits: Habit[];
    onAddHabit: (name: string) => void;
    onUpdateHabit: (id: string, newName: string) => void;
    onDeleteHabit: (id: string) => void;
    onToggleCompletion: (habitId: string, date: string) => void;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, onAddHabit, onUpdateHabit, onDeleteHabit, onToggleCompletion }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [newHabitName, setNewHabitName] = useState('');
    const [editingHabit, setEditingHabit] = useState<{ id: string, name: string } | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' });

    // For highlighting today's date
    const today = new Date();
    const isCurrentMonthAndYear = today.getFullYear() === year && today.getMonth() === month;
    const todayDate = today.getDate();

    const goToPreviousMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const handleNewHabitSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onAddHabit(newHabitName);
            setNewHabitName('');
        }
    };
    
    const startEditing = (habit: Habit) => {
        setEditingHabit({ id: habit.id, name: habit.name });
    };

    const cancelEditing = () => {
        setEditingHabit(null);
    };

    const handleUpdateSubmit = () => {
        if (editingHabit) {
            onUpdateHabit(editingHabit.id, editingHabit.name);
            setEditingHabit(null);
        }
    };
    
    const handleEditingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editingHabit) {
            setEditingHabit({ ...editingHabit, name: e.target.value });
        }
    };
    
    const handleEditingKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleUpdateSubmit();
        } else if (e.key === 'Escape') {
            cancelEditing();
        }
    };

    return (
        <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h2 className="text-2xl font-bold text-gray-100">Habit Tracker</h2>
                <div className="flex items-center gap-4">
                    <button onClick={goToPreviousMonth} className="px-3 py-1 bg-[#252525] rounded-md hover:bg-[#333]">&lt;</button>
                    <span className="text-lg font-semibold text-center whitespace-nowrap">{monthName} {year}</span>
                    <button onClick={goToNextMonth} className="px-3 py-1 bg-[#252525] rounded-md hover:bg-[#333]">&gt;</button>
                </div>
            </div>

            <div className="flex-grow">
                <table className="w-full border-collapse table-fixed">
                    <thead>
                        <tr className="text-xs text-gray-400">
                            <th className="sticky left-0 bg-[#1C1C1C] p-2 border-b border-r border-dotted border-gray-700 w-48 text-left">HABIT</th>
                            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                                const isToday = isCurrentMonthAndYear && day === todayDate;
                                return (
                                    <th key={day} className={`p-2 border-b border-dotted border-gray-700 text-center`}>
                                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${isToday ? 'border border-white' : ''}`}>
                                            {day}
                                        </span>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {habits.map(habit => {
                            const isEditing = editingHabit?.id === habit.id;
                            return (
                                <tr key={habit.id} className="group hover:bg-[#252525]/50">
                                    <td className="sticky left-0 bg-inherit p-2 border-r border-dotted border-gray-700 font-medium text-gray-200">
                                        <div className="flex items-center justify-between gap-2">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editingHabit.name}
                                                    onChange={handleEditingChange}
                                                    onKeyDown={handleEditingKeyDown}
                                                    onBlur={handleUpdateSubmit}
                                                    className="bg-[#333] text-white w-full px-1 py-0.5 rounded-md outline-none ring-2 ring-blue-600"
                                                    autoFocus
                                                />
                                            ) : (
                                                <span onClick={() => startEditing(habit)} className="cursor-pointer flex-grow truncate">{habit.name}</span>
                                            )}
                                            <button onClick={() => onDeleteHabit(habit.id)} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                                        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                        const isCompleted = habit.completions[dateKey];
                                        return (
                                            <td key={day} className={`p-2 border-t border-dotted border-gray-700 text-center`}>
                                                <input
                                                    type="checkbox"
                                                    checked={!!isCompleted}
                                                    onChange={() => onToggleCompletion(habit.id, dateKey)}
                                                    className="w-5 h-5 bg-[#333] border-gray-600 rounded text-blue-600 focus:ring-blue-600 focus:ring-2 cursor-pointer appearance-none checked:bg-blue-600 checked:before:content-['✓'] checked:before:text-white checked:before:text-sm checked:before:block checked:before:text-center checked:before:leading-5"
                                                />
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="sticky left-0 bg-inherit p-2 border-t border-r border-dotted border-gray-700">
                                <input
                                    type="text"
                                    value={newHabitName}
                                    onChange={(e) => setNewHabitName(e.target.value)}
                                    onKeyDown={handleNewHabitSubmit}
                                    placeholder="Add a new habit..."
                                    className="bg-transparent text-gray-300 w-full placeholder-gray-500 outline-none"
                                />
                            </td>
                            <td colSpan={daysInMonth} className="p-2 border-t border-dotted border-gray-700"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default HabitTracker;