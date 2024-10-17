import React, { useState } from 'react';

function ToDoItem(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(props.task.text);

  // Toggle editing mode
  function toggleEditing() {
    setIsEditing(!isEditing);
    setEditText(props.task.text);
  }

  // Save edited task
  function saveTask() {
    props.onEdit(props.task.id, editText);
    setIsEditing(false);
  }

  return (
    <li className={`todo-item ${props.task.isCompleted ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={props.task.isCompleted}
        onChange={() => props.onToggleComplete(props.task.id)}
      />
      {isEditing ? (
        <input
          type="text"
          className="edit-input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
        />
      ) : (
        <span>{props.task.text}</span>
      )}
      <div className="button-group">
        {isEditing ? (
          <button className="save-button" onClick={saveTask}>
            Save
          </button>
        ) : (
          <>
            <button className="edit-button" onClick={toggleEditing}>
              Edit
            </button>
            <button
              className="delete-button"
              onClick={() => props.onDelete(props.task.id)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
}

export default ToDoItem;
