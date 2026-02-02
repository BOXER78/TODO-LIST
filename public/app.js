const API_URL = '/api/todos';

// Theme Logic
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateIcon(true);
} else {
    updateIcon(false);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcon(newTheme === 'dark');
});

function updateIcon(isDark) {
    // Sun / Moon path
    if (isDark) {
        themeToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    } else {
        themeToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    }
}

// Logic
const taskInput = document.getElementById('taskInput');
const descInput = document.getElementById('descInput');
const priorityInput = document.getElementById('priorityInput');
const dateInput = document.getElementById('dateInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const searchInput = document.getElementById('searchInput');
const filterPriority = document.getElementById('filterPriority');

let debounceTimer;

async function fetchTasks() {
    const search = searchInput.value;
    const priority = filterPriority.value;

    let url = `${API_URL}?sortBy=createdAt&sortOrder=desc`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (priority) url += `&priority=${priority}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
            renderTasks(data.data || data.items); // Handle both formats if your API varies
        }
    } catch (err) {
        console.error("Failed to fetch tasks", err);
    }
}

function renderTasks(tasks) {
    taskList.innerHTML = '';
    taskCount.textContent = `${tasks.length} tasks`;

    if (tasks.length === 0) {
        taskList.innerHTML = `<div style="text-align:center; padding: 2rem; color: var(--text-secondary);">No tasks found. Time to relax?</div>`;
        return;
    }

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.isCompleted ? 'completed-task' : ''}`;

        // Date formatting
        const dateStr = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '';

        li.innerHTML = `
            <div class="task-checkbox-wrapper">
                <input type="checkbox" class="task-checkbox" 
                    ${task.isCompleted ? 'checked' : ''} 
                    onchange="toggleTask('${task._id}', this.checked)">
            </div>
            <div class="task-content">
                <div class="task-title">${escapeHtml(task.title)}</div>
                ${task.description ? `<div class="task-desc">${escapeHtml(task.description)}</div>` : ''}
                <div class="task-meta">
                    <span class="tag tag-${task.priority.toLowerCase()}">${task.priority}</span>
                    ${dateStr ? `<span class="date-tag"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> ${dateStr}</span>` : ''}
                </div>
            </div>
            <button class="delete-btn" onclick="deleteTask('${task._id}')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        `;
        taskList.appendChild(li);
    });
}

async function addTask() {
    const title = taskInput.value.trim();
    if (!title) return;

    const body = {
        title,
        description: descInput.value.trim(),
        priority: priorityInput.value,
        dueDate: dateInput.value || undefined
    };

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data.success) {
            // Reset form
            taskInput.value = '';
            descInput.value = '';
            dateInput.value = '';
            priorityInput.value = 'medium';
            fetchTasks();
        }
    } catch (err) {
        console.error("Failed to add task", err);
    }
}

window.toggleTask = async (id, isCompleted) => {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isCompleted })
        });
        fetchTasks();
    } catch (err) {
        console.error("Failed to toggle task", err);
    }
}

window.deleteTask = async (id) => {
    // if (!confirm("Are you sure?")) return;
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchTasks();
    } catch (err) {
        console.error("Failed to delete task", err);
    }
};

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });

searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fetchTasks, 300);
});

filterPriority.addEventListener('change', fetchTasks);

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Init
fetchTasks();
