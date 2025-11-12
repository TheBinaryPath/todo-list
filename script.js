// Get DOM elements
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const counts = document.getElementById('counts');
const clearCompletedBtn = document.getElementById('clearCompleted');

let tasks = []; // array of { id, text, done }

// Load tasks from localStorage
function loadTasks() {
  const raw = localStorage.getItem('todo.tasks');
  tasks = raw ? JSON.parse(raw) : [];
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('todo.tasks', JSON.stringify(tasks));
}

// Create unique id
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,6);
}

// Render tasks list
function render() {
  taskList.innerHTML = '';
  if (tasks.length === 0) {
    taskList.innerHTML = '<li style="text-align:center;color:#666;padding:12px;border-radius:8px;background:#fbfbfb;">No tasks yet — add one!</li>';
  } else {
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = task.done ? 'completed' : '';

      const left = document.createElement('div');
      left.className = 'item-left';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = task.done;
      cb.className = 'checkbox';
      cb.addEventListener('change', () => {
        task.done = cb.checked;
        saveTasks();
        render();
      });

      const span = document.createElement('div');
      span.className = 'text';
      span.textContent = task.text;
      span.title = 'Double click to edit';

      // edit on double click
      span.addEventListener('dblclick', () => {
        const edited = prompt('Edit task:', task.text);
        if (edited === null) return;
        const trimmed = edited.trim();
        if (trimmed) {
          task.text = trimmed;
          saveTasks();
          render();
        }
      });

      left.appendChild(cb);
      left.appendChild(span);

      const actions = document.createElement('div');
      actions.className = 'actions';

      const editBtn = document.createElement('button');
      editBtn.className = 'action edit';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => {
        const edited = prompt('Edit task:', task.text);
        if (edited === null) return;
        const trimmed = edited.trim();
        if (trimmed) {
          task.text = trimmed;
          saveTasks();
          render();
        }
      });

      const delBtn = document.createElement('button');
      delBtn.className = 'action delete';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', () => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        render();
      });

      actions.appendChild(editBtn);
      actions.appendChild(delBtn);

      li.appendChild(left);
      li.appendChild(actions);
      taskList.appendChild(li);
    });
  }

  // update counts
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  counts.textContent = `${done} completed • ${total - done} remaining • ${total} total`;
}

// Add new task
taskForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return alert('Please enter a task.');
  tasks.unshift({ id: uid(), text, done: false });
  taskInput.value = '';
  saveTasks();
  render();
});

// Clear completed tasks
clearCompletedBtn.addEventListener('click', () => {
  const hasCompleted = tasks.some(t => t.done);
  if (!hasCompleted) { alert('No completed tasks to clear.'); return; }
  if (!confirm('Remove all completed tasks?')) return;
  tasks = tasks.filter(t => !t.done);
  saveTasks();
  render();
});

// initial load
loadTasks();
render();
