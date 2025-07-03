let notes = [];

window.onload = () => {
  const storedNotes = localStorage.getItem("stickyNotes");
  notes = storedNotes ? JSON.parse(storedNotes) : [];
  displayNotes();
};

function addNote() {
  const input = document.getElementById('noteInput');
  const error = document.getElementById('errorMessage');
  const text = input.value.trim();

  if (text === '') {
    error.style.display = 'block';
    return;
  }

  error.style.display = 'none';

  const note = {
    id: Date.now(),
    content: text,
    date: new Date().toLocaleDateString(),
    priority: false,
    color: getRandomColor()
  };

  notes.push(note);
  input.value = '';
  saveNotes();
  displayNotes();
}

function displayNotes() {
  const container = document.getElementById('notesContainer');
  container.innerHTML = '';

  notes.forEach((note, index) => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-4';

    const card = document.createElement('div');
    card.className = `card shadow-sm note-card ${note.priority ? 'priority-border' : ''}`;
    card.style.backgroundColor = note.color;
    card.style.color = '#333';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', index * 100);

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const date = document.createElement('div');
    date.className = 'note-date mb-2';
    date.textContent = `📅 ${note.date}`;

    if (note.priority) {
      const priorityBadge = document.createElement('span');
      priorityBadge.className = 'badge bg-danger mb-2';
      priorityBadge.textContent = 'Priority';
      cardBody.appendChild(priorityBadge);
    }

    const content = document.createElement('p');
    content.textContent = note.content;
    content.className = `highlight-content ${note.priority ? 'text-danger' : ''}`;

    const textarea = document.createElement('textarea');
    textarea.className = 'form-control mb-3 d-none';
    textarea.rows = 4;
    textarea.value = note.content;

    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-outline-secondary btn-sm me-2';
    editBtn.innerHTML = '🖉 Edit';
    editBtn.onclick = () => {
      textarea.classList.toggle('d-none');
      content.classList.toggle('d-none');
      if (!textarea.classList.contains('d-none')) {
        textarea.focus();
      } else {
        editNote(note.id, textarea.value);
      }
    };

    const priorityCheckbox = document.createElement('input');
    priorityCheckbox.type = 'checkbox';
    priorityCheckbox.className = 'form-check-input me-2';
    priorityCheckbox.checked = note.priority;
    priorityCheckbox.onchange = () => togglePriority(note.id, priorityCheckbox.checked);

    const priorityLabel = document.createElement('label');
    priorityLabel.className = 'form-check-label me-3';
    priorityLabel.textContent = 'Priority';

    const checkboxWrapper = document.createElement('div');
    checkboxWrapper.className = 'form-check form-switch mb-2';
    checkboxWrapper.appendChild(priorityCheckbox);
    checkboxWrapper.appendChild(priorityLabel);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-outline-danger btn-sm';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteNote(note.id);

    cardBody.appendChild(date);
    cardBody.appendChild(content);
    cardBody.appendChild(textarea);
    cardBody.appendChild(editBtn);
    cardBody.appendChild(checkboxWrapper);
    cardBody.appendChild(deleteBtn);

    card.appendChild(cardBody);
    col.appendChild(card);
    container.appendChild(col);
  });

  AOS.refresh();
}

function editNote(id, newText) {
  const note = notes.find(n => n.id === id);
  if (note) {
    note.content = newText;
    saveNotes();
    displayNotes();
  }
}

function togglePriority(id, isPriority) {
  const note = notes.find(n => n.id === id);
  if (note) {
    note.priority = isPriority;
    saveNotes();
    displayNotes();
  }
}

function deleteNote(id) {
  notes = notes.filter(n => n.id !== id);
  saveNotes();
  displayNotes();
}

function saveNotes() {
  localStorage.setItem('stickyNotes', JSON.stringify(notes));
}

function getRandomColor() {
  const colors = [
    '#FFEBEE', '#FFF3E0', '#E8F5E9', '#E3F2FD',
    '#F3E5F5', '#FBE9E7', '#E0F7FA', '#FFFDE7'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

