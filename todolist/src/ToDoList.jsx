import React from 'react';
import ToDoItem from './ToDoItem';

function ToDoList(props) {
  return (
    <ul className="todo-list">
      {props.tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        props.tasks.map((task) => (
          <ToDoItem
            key={task.id}
            task={task}
            onDelete={props.onDelete}
            onToggleComplete={props.onToggleComplete}
            onEdit={props.onEdit}
          />
        ))
      )}
    </ul>
  );
}

export default ToDoList;
