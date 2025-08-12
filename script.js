document.addEventListener("DOMContentLoaded", () => {
    // --- DOM Element Selectors ---
    const notesGrid = document.getElementById("notes-grid");
    const newNoteBtn = document.getElementById("new-note-btn");
    const searchInput = document.getElementById("search-input");
    
    // Modal elements
    const modalContainer = document.getElementById("modal-container");
    const noteIdInput = document.getElementById("note-id-input");
    const noteTitleInput = document.getElementById("note-title-input");
    const noteContentInput = document.getElementById("note-content-input");
    const saveNoteBtn = document.getElementById("save-note-btn");
    // **** NEW: SELECT THE DELETE BUTTON ****
    const deleteNoteBtn = document.getElementById("delete-note-btn");

    // --- State Management ---
    let currentNotes = [];
    let currentFilter = "";

    // --- Functions ---

    const getNotesFromStorage = () => {
        try {
            const notes = JSON.parse(localStorage.getItem("notes-app-data"));
            return Array.isArray(notes) ? notes : [];
        } catch {
            return [];
        }
    };

    const saveNotesToStorage = (notes) => {
        localStorage.setItem("notes-app-data", JSON.stringify(notes));
    };

    const createNoteElement = (note) => {
        const wordCount = note.content.trim().split(/\s+/).filter(Boolean).length;
        const date = new Date(note.id).toLocaleDateString("en-US", { day: 'numeric', month: 'long' });

        const noteCard = document.createElement("div");
        noteCard.classList.add("note-card");
        noteCard.dataset.id = note.id;
        
        noteCard.innerHTML = `
            <h3 class="note-title">${note.title || 'Untitled'}</h3>
            <p class="note-content-preview">${note.content}</p>
            <div class="note-footer">
                <span class="note-date">Today</span> 
                <span class="note-words">${wordCount} words</span>
            </div>
        `;

        noteCard.addEventListener("click", () => openModal(note));
        return noteCard;
    };

    const renderNotes = () => {
        notesGrid.innerHTML = "";
        const filteredNotes = currentNotes.filter(note => 
            note.title.toLowerCase().includes(currentFilter) || 
            note.content.toLowerCase().includes(currentFilter)
        );

        if (filteredNotes.length === 0 && currentFilter === "") {
             notesGrid.innerHTML = '<p style="color: var(--secondary-text-color);">Your notes will appear here. Click "+ New Note" to start.</p>';
        } else if (filteredNotes.length === 0) {
            notesGrid.innerHTML = `<p style="color: var(--secondary-text-color);">No notes found for "${currentFilter}".</p>`;
        } else {
            filteredNotes.forEach(note => {
                notesGrid.appendChild(createNoteElement(note));
            });
        }
    };
    
    // **** MODIFIED: SHOW/HIDE DELETE BUTTON ****
    const openModal = (note = null) => {
        if (note) { // Editing an existing note
            noteIdInput.value = note.id;
            noteTitleInput.value = note.title;
            noteContentInput.value = note.content;
            deleteNoteBtn.style.display = 'block'; // Show delete button
        } else { // Creating a new note
            noteIdInput.value = "";
            noteTitleInput.value = "";
            noteContentInput.value = "";
            deleteNoteBtn.style.display = 'none'; // Hide delete button
        }
        modalContainer.classList.add("show");
    };

    const closeModal = () => {
        modalContainer.classList.remove("show");
    };

    const handleSaveNote = () => {
        const id = noteIdInput.value;
        const title = noteTitleInput.value.trim();
        const content = noteContentInput.value.trim();

        if (id) {
            currentNotes = currentNotes.map(note => 
                note.id == id ? { ...note, title, content } : note
            );
        } else {
            const newNote = {
                id: new Date().getTime(),
                title: title || "Untitled", // Default title
                content
            };
            currentNotes.unshift(newNote);
        }
        
        saveNotesToStorage(currentNotes);
        renderNotes();
        closeModal();
    };

    // **** NEW: FUNCTION TO HANDLE NOTE DELETION ****
    const handleDeleteNote = () => {
        const id = noteIdInput.value;
        if (!id) return;

        // Add a confirmation dialog
        if (confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
            currentNotes = currentNotes.filter(note => note.id != id);
            saveNotesToStorage(currentNotes);
            renderNotes();
            closeModal();
        }
    };
    
    // --- Event Listeners ---
    newNoteBtn.addEventListener("click", () => openModal());
    saveNoteBtn.addEventListener("click", handleSaveNote);
    // **** NEW: EVENT LISTENER FOR DELETE BUTTON ****
    deleteNoteBtn.addEventListener("click", handleDeleteNote);
    
    searchInput.addEventListener("input", (e) => {
        currentFilter = e.target.value.toLowerCase();
        renderNotes();
    });

    modalContainer.addEventListener("click", (e) => {
        if (e.target === modalContainer) {
            closeModal();
        }
    });
    
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalContainer.classList.contains("show")) {
            closeModal();
        }
    });

    // --- Initial Load ---
    currentNotes = getNotesFromStorage();
    renderNotes();
});
