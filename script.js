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
    const deleteNoteBtn = document.getElementById("delete-note-btn");

    // --- State Management ---
    let currentNotes = [];
    let currentFilter = "";

    // --- Functions ---

    // Get notes from localStorage
    const getNotesFromStorage = () => {
        try {
            const notes = JSON.parse(localStorage.getItem("notes-app-data"));
            return Array.isArray(notes) ? notes : [];
        } catch {
            return [];
        }
    };

    // Save notes to localStorage
    const saveNotesToStorage = (notes) => {
        localStorage.setItem("notes-app-data", JSON.stringify(notes));
    };

    // Create HTML for a single note card
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
                <span class="note-date">Today</span> <!-- Simplified date -->
                <span class="note-words">${wordCount} words</span>
            </div>
        `;

        noteCard.addEventListener("click", () => openModal(note));
        return noteCard;
    };

    // Render notes to the grid
    const renderNotes = () => {
        notesGrid.innerHTML = "";
        const filteredNotes = currentNotes.filter(note => 
            note.title.toLowerCase().includes(currentFilter) || 
            note.content.toLowerCase().includes(currentFilter)
        );

        if (filteredNotes.length === 0) {
            notesGrid.innerHTML = '<p style="color: var(--secondary-text-color);">No notes found. Create one!</p>';
            return;
        }

        filteredNotes.forEach(note => {
            notesGrid.appendChild(createNoteElement(note));
        });
    };

    // Open the modal to edit/create a note
    const openModal = (note = null) => {
        if (note) {
            noteIdInput.value = note.id;
            noteTitleInput.value = note.title;
            noteContentInput.value = note.content;
            deleteNoteBtn.style.display = 'block';
        } else {
            noteIdInput.value = "";
            noteTitleInput.value = "";
            noteContentInput.value = "";
            deleteNoteBtn.style.display = 'none';
        }
        modalContainer.classList.add("show");
    };

    // Close the modal
    const closeModal = () => {
        modalContainer.classList.remove("show");
    };

    // Handle saving a note
    const handleSaveNote = () => {
        const id = noteIdInput.value;
        const title = noteTitleInput.value.trim();
        const content = noteContentInput.value.trim();

        if (id) { // Update existing note
            currentNotes = currentNotes.map(note => 
                note.id == id ? { ...note, title, content } : note
            );
        } else { // Create new note
            const newNote = {
                id: new Date().getTime(), // Unique ID based on timestamp
                title,
                content
            };
            currentNotes.unshift(newNote); // Add to the beginning
        }
        
        saveNotesToStorage(currentNotes);
        renderNotes();
        closeModal();
    };

    // Handle deleting a note
    const handleDeleteNote = () => {
        const id = noteIdInput.value;
        if (!id) return;

        if (confirm("Are you sure you want to delete this note?")) {
            currentNotes = currentNotes.filter(note => note.id != id);
            saveNotesToStorage(currentNotes);
            renderNotes();
            closeModal();
        }
    };
    
    // --- Event Listeners ---
    newNoteBtn.addEventListener("click", () => openModal());
    saveNoteBtn.addEventListener("click", handleSaveNote);
    deleteNoteBtn.addEventListener("click", handleDeleteNote);
    searchInput.addEventListener("input", (e) => {
        currentFilter = e.target.value.toLowerCase();
        renderNotes();
    });

    // Close modal if clicking on the background
    modalContainer.addEventListener("click", (e) => {
        if (e.target === modalContainer) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalContainer.classList.contains("show")) {
            closeModal();
        }
    });


    // --- Initial Load ---
    currentNotes = getNotesFromStorage();
    renderNotes();
});
