import React from 'react';

function TaskItem({ task, onToggle }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <input
        id={`task-${task.id}`}
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
      />
      <label htmlFor={`task-${task.id}`} className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
        {task.description}
      </label>
    </div>
  );
}

export default TaskItem;


