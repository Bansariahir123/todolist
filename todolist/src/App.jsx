import React, { useState, useEffect } from 'react';
import Header from './Header';
import ToDoList from './ToDoList';
import './App.css'; // Adding CSS for better styling
import { openDB } from 'idb';

function App(props) {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize the IndexedDB database
  async function initDB() {
    const db = await openDB('taskDB', 1, {
      upgrade(db) {
        db.createObjectStore('tasks', { keyPath: 'id' });
      },
    });
    return db;
  }

  // Load tasks from IndexedDB when the app loads
  useEffect(() => {
    async function loadTasks() {
      const db = await initDB();
      const tx = db.transaction('tasks', 'readonly');
      const store = tx.objectStore('tasks');
      const allTasks = await store.getAll();
      setTasks(allTasks);
    }
    loadTasks();
  }, []);

  // Add a new task to IndexedDB
  async function addTaskToDB(task) {
    const db = await initDB();
    const tx = db.transaction('tasks', 'readwrite');
    const store = tx.objectStore('tasks');
    await store.add(task);
    await tx.done;
  }

  // Delete a task from IndexedDB
  async function deleteTaskFromDB(id) {
    const db = await initDB();
    const tx = db.transaction('tasks', 'readwrite');
    const store = tx.objectStore('tasks');
    await store.delete(id);
    await tx.done;
  }

  // Update a task in IndexedDB
  async function updateTaskInDB(task) {
    const db = await initDB();
    const tx = db.transaction('tasks', 'readwrite');
    const store = tx.objectStore('tasks');
    await store.put(task);
    await tx.done;
  }

  // Add a new task
  function addTask() {
    if (inputValue.trim() === '') {
      setErrorMessage('The field is empty. Please enter a task.');
      return;
    }
    setErrorMessage(''); // Clear error message
    const newTask = {
      id: new Date().getTime(),
      text: inputValue,
      isCompleted: false,
    };
    setTasks((prevTasks) => {
      addTaskToDB(newTask); // Add to IndexedDB
      return [...prevTasks, newTask];
    });
    setInputValue('');
  }

  // Delete a task
  function deleteTask(id) {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.filter((task) => task.id !== id);
      deleteTaskFromDB(id); // Remove from IndexedDB
      return updatedTasks;
    });
  }

  // Toggle task completion
  function toggleTaskCompletion(id) {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    );
    setTasks(updatedTasks);
    const taskToUpdate = updatedTasks.find((task) => task.id === id);
    updateTaskInDB(taskToUpdate); // Update in IndexedDB
  }

  // Edit task
  function editTask(id, newText) {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, text: newText } : task
    );
    setTasks(updatedTasks);
    const taskToUpdate = updatedTasks.find((task) => task.id === id);
    updateTaskInDB(taskToUpdate); // Update in IndexedDB
  }

  return (
    <div className="app-container">
      <Header title={props.title} />
      <div className="todo-form">
        <input
          type="text"
          className="todo-input"
          placeholder="Add a new task"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button className="add-button" onClick={addTask}>
          Add
        </button>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <ToDoList
        tasks={tasks}
        onDelete={deleteTask}
        onToggleComplete={toggleTaskCompletion}
        onEdit={editTask}
      />
    </div>
  );
}

export default App;
