// public/js/app.js

// Minimalist frontend logic
const apiBase = ''; // when served from same origin, leave empty

const authDiv = document.getElementById('auth');
const todoDiv = document.getElementById('todo-section');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const authError = document.getElementById('auth-error');

const todoList = document.getElementById('todo-list');
const newTaskInput = document.getElementById('new-task');
const todoError = document.getElementById('todo-error');

// Buttons
document.getElementById('btn-login').onclick = () => auth('login');
document.getElementById('btn-register').onclick = () => auth('register');
document.getElementById('btn-add').onclick = addTodo;
document.getElementById('btn-logout').onclick = logout;

// Check on load
window.onload = () => {
  const token = localStorage.getItem('token');
  if (token) showTodos();
};

// Auth (login or register)
async function auth(action) {
  authError.textContent = '';
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  if (!username || !password) {
    authError.textContent = 'Please fill both fields';
    return;
  }

  try {
    const res = await fetch(`${apiBase}/auth/${action}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      showTodos();
    } else {
      authError.textContent = data.message || 'Auth error';
    }
  } catch {
    authError.textContent = 'Network error';
  }
}

// Fetch & display todos
async function showTodos() {
  authDiv.classList.add('hidden');
  todoDiv.classList.remove('hidden');
  todoError.textContent = '';
  todoList.innerHTML = '';

  const token = localStorage.getItem('token');
  const res = await fetch(`${apiBase}/todos`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) {
    todoError.textContent = 'Failed to load todos';
    return;
  }
  const todos = await res.json();
  todos.forEach(renderTodo);
}

// Render a single todo item
function renderTodo(todo) {
  const li = document.createElement('li');
  if (todo.completed) li.classList.add('completed');

  const chk = document.createElement('input');
  chk.type = 'checkbox';
  chk.checked = todo.completed;
  chk.onchange = () => toggleTodo(todo.id, chk.checked, li);

  const span = document.createElement('span');
  span.textContent = todo.task;
  span.className = 'task';

  const del = document.createElement('button');
  del.textContent = '×';
  del.onclick = () => deleteTodo(todo.id, li);

  li.append(chk, span, del);
  todoList.appendChild(li);
}

// Add new todo
async function addTodo() {
  const task = newTaskInput.value.trim();
  if (!task) return;
  newTaskInput.value = '';

  const token = localStorage.getItem('token');
  const res = await fetch(`${apiBase}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ task })
  });
  if (res.ok) {
    const todo = await res.json();
    renderTodo(todo);
  } else {
    todoError.textContent = 'Failed to add';
  }
}

// Toggle completed status
async function toggleTodo(id, completed, li) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${apiBase}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ completed })
  });
  if (res.ok) {
    li.classList.toggle('completed', completed);
  } else {
    todoError.textContent = 'Failed to update';
  }
}

// Delete a todo
async function deleteTodo(id, li) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${apiBase}/todos/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (res.ok) {
    li.remove();
  } else {
    todoError.textContent = 'Failed to delete';
  }
}

// Log out
function logout() {
  localStorage.removeItem('token');
  todoDiv.classList.add('hidden');
  authDiv.classList.remove('hidden');
  usernameInput.value = '';
  passwordInput.value = '';
  todoList.innerHTML = '';
}

